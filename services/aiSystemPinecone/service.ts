import { Pinecone } from '@pinecone-database/pinecone';
import { prisma } from '@repo/prisma/db';
import { google } from '@ai-sdk/google';
import { embed } from 'ai';
import { env } from '@repo/zod-schemas/environment/environments.z.js';
import type { AnalyticsData, FiltersData, FundWithProjection, MutualFund, RecommendationInput } from '@repo/zod-schemas/types/mutualFund.types';

const pc = new Pinecone({ apiKey: env.PINECONE_API_KEY });
const indexName = env.PINECONE_INDEX_NAME || 'mutual-funds-index';

export async function getRecommendations(input: RecommendationInput): Promise<FundWithProjection[]> {
  const { amcName, category, amountInvested, tenure, investmentType } = input;

  let queryText = `${investmentType || 'SIP'} investment recommendation for ${amountInvested} rupees over ${tenure} years`;
  
  if (category) queryText += ` in ${category} category funds`;
  if (amcName && amcName !== 'all') queryText += ` from ${amcName} asset management company`;

  const result = await embed({
    model: google.textEmbedding('text-embedding-004'),
    value: queryText,
  });

  const index = pc.index(indexName);
  // Use embedding as-is for 768 dimension index
  const embedding = result.embedding;

  const results = await index.query({
    vector: embedding,
    topK: 10,
    includeMetadata: true,
    filter: {
      ...(amcName && amcName !== 'all' && { amc_name: amcName }),
      ...(category && { category: category }),
    },
  });

  const fundIds = results.matches?.map(m => m.id) || [];
  
  const funds: MutualFund[] = await prisma.mutualFund.findMany({
    where: { id: { in: fundIds } },
  });

  const rankedFunds = funds
    .map((fund: MutualFund) => {
      const expectedReturn = tenure >= 5 && fund.returns5yr ? fund.returns5yr :
                            tenure >= 3 && fund.returns3yr ? fund.returns3yr :
                            fund.returns1yr || 0;
      
      const projectedValue = amountInvested * Math.pow(1 + expectedReturn / 100, tenure);
      const score = (fund.rating * 20) + (expectedReturn * 5) - (fund.riskLevel * 2);

      return {
        ...fund,
        expectedReturn,
        projectedValue: Math.round(projectedValue),
        score,
      };
    })
    .sort((a: FundWithProjection, b: FundWithProjection) => b.score - a.score);

  return rankedFunds;
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const totalFunds = await prisma.mutualFund.count();
  
  const byCategory = await prisma.mutualFund.groupBy({
    by: ['category'],
    _count: true,
  });

  const byAMC = await prisma.mutualFund.groupBy({
    by: ['amcName'],
    _count: true,
    orderBy: { _count: { amcName: 'desc' } },
    take: 10,
  });

  const avgReturns = await prisma.mutualFund.aggregate({
    _avg: { returns1yr: true, returns3yr: true, returns5yr: true },
  });

  return {
    totalFunds,
    byCategory,
    topAMCs: byAMC,
    avgReturns: avgReturns._avg,
  };
}

export async function getAllFunds(filters?: {
  category?: string;
  amcName?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ funds: FundWithProjection[]; totalCount: number }> {
  const { category, amcName, search, limit = 50, offset = 0 } = filters || {};
  
  const whereClause: any = {};
  
  if (category) {
    whereClause.category = { equals: category, mode: 'insensitive' };
  }
  
  if (amcName) {
    whereClause.amcName = { contains: amcName, mode: 'insensitive' };
  }
  
  if (search) {
    whereClause.OR = [
      { schemeName: { contains: search, mode: 'insensitive' } },
      { amcName: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  const [funds, totalCount] = await Promise.all([
    prisma.mutualFund.findMany({
      where: whereClause,
      orderBy: [{ rating: 'desc' }, { returns5yr: 'desc' }],
      take: limit,
      skip: offset,
    }),
    prisma.mutualFund.count({ where: whereClause })
  ]);
  
  const processedFunds = funds.map((fund) => {
    const expectedReturn = fund.returns5yr || fund.returns3yr || fund.returns1yr || 0;
    const projectedValue = 10000 * Math.pow(1 + expectedReturn / 100, 3);
    const score = fund.rating * 25 + expectedReturn * 6 - fund.riskLevel * 3;
    
    return {
      ...fund,
      expectedReturn,
      projectedValue: Math.round(projectedValue),
      score: Math.round(score * 100) / 100,
    };
  });
  
  return { funds: processedFunds, totalCount };
}

export async function getFundDetails(fundId: string): Promise<MutualFund | null> {
  return prisma.mutualFund.findUnique({ where: { id: fundId } });
}

export async function getFilters(): Promise<FiltersData> {
  const amcs: { amcName: string }[] = await prisma.mutualFund.findMany({
    select: { amcName: true },
    distinct: ['amcName'],
    orderBy: { amcName: 'asc' },
  });

  const categories: { category: string; subCategory: string }[] = await prisma.mutualFund.findMany({
    select: { category: true, subCategory: true },
    distinct: ['category', 'subCategory'],
    orderBy: { category: 'asc' },
  });

  return {
    amcs: amcs.map((a: { amcName: string }) => a.amcName),
    categories: categories.reduce((acc: Record<string, string[]>, c: { category: string; subCategory: string }) => {
      if (!acc[c.category]) acc[c.category] = [];
      acc[c.category]?.push(c.subCategory);
      return acc;
    }, {} as Record<string, string[]>),
  };
}
