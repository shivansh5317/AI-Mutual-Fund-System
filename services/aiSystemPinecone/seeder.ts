import { Pinecone } from "@pinecone-database/pinecone";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { prisma } from "@repo/prisma/db";
import { env } from "@repo/zod-schemas/environment/environments.z.js";
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';
import type { CSVRecord, MutualFundData, PineconeIndex } from "@repo/zod-schemas/types/mutualFund.types";

const pc = new Pinecone({ apiKey: env.PINECONE_API_KEY! });

const indexName = env.PINECONE_INDEX_NAME || "mutual-funds-index";

async function createIndex() {
  const existingIndexes = await pc.listIndexes();
  const existingIndex = existingIndexes.indexes?.find((idx: PineconeIndex) => idx.name === indexName);
  
  if (existingIndex) {
    console.log("Deleting existing index...");
    await pc.deleteIndex(indexName);
    console.log("Waiting for index deletion...");
    await new Promise((resolve) => setTimeout(resolve, 30000));
  }
  
  console.log("Creating new index with dimension 768...");
  await pc.createIndex({
    name: indexName,
    dimension: 768,
    metric: "cosine",
    spec: {
      serverless: {
        cloud: "aws",
        region: "us-east-1",
      },
    },
  });
  console.log("Index created, waiting for initialization...");
  await new Promise((resolve) => setTimeout(resolve, 60000));
}

async function seedData() {
  const csvPath =
    env.CSV_PATH || "/Users/srajansaxena/Desktop/MF_India_AI.csv";
  const csvData = readFileSync(csvPath, "utf-8");

  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  });

  // await createIndex();
  const index = pc.index(indexName);

  console.log(`Processing ${records.length} mutual funds...`);

  for (const record of records as CSVRecord[]) {
    const fundData: MutualFundData = {
      schemeName: record.scheme_name,
      minSip: parseFloat(record.min_sip) || 0,
      minLumpsum: parseFloat(record.min_lumpsum) || 0,
      expenseRatio: parseFloat(record.expense_ratio) || 0,
      fundSizeCr: parseFloat(record.fund_size_cr) || 0,
      fundAgeYr: parseFloat(record.fund_age_yr) || 0,
      fundManager: record.fund_manager,
      sortino: record.sortino ? parseFloat(record.sortino) : null,
      alpha: record.alpha ? parseFloat(record.alpha) : null,
      sd: record.sd ? parseFloat(record.sd) : null,
      beta: record.beta ? parseFloat(record.beta) : null,
      sharpe: record.sharpe ? parseFloat(record.sharpe) : null,
      riskLevel: parseInt(record.risk_level) || 0,
      amcName: record.amc_name,
      rating: parseInt(record.rating) || 0,
      category: record.category,
      subCategory: record.sub_category,
      returns1yr: record.returns_1yr ? parseFloat(record.returns_1yr) : null,
      returns3yr: record.returns_3yr ? parseFloat(record.returns_3yr) : null,
      returns5yr: record.returns_5yr ? parseFloat(record.returns_5yr) : null,
    };

    const fund = await prisma.mutualFund.create({ data: fundData });

    const textForEmbedding = `${fundData.schemeName}. AMC: ${fundData.amcName}. Category: ${fundData.category} - ${fundData.subCategory}. Risk Level: ${fundData.riskLevel}. Rating: ${fundData.rating} stars. Returns: 1yr=${fundData.returns1yr}%, 3yr=${fundData.returns3yr}%, 5yr=${fundData.returns5yr}%. Fund Manager: ${fundData.fundManager}. Expense Ratio: ${fundData.expenseRatio}%. Fund Size: ${fundData.fundSizeCr} Cr.`;

    // Generate semantic embedding from fund description
    const { embedding } = await embed({
      model: google.textEmbedding('text-embedding-004'),
      value: textForEmbedding,
    });

    await index.upsert([
      {
        id: fund.id,
        values: embedding,
        metadata: {
          text: textForEmbedding,
          scheme_name: fundData.schemeName,
          amc_name: fundData.amcName,
          category: fundData.category,
          sub_category: fundData.subCategory,
          risk_level: fundData.riskLevel,
          rating: fundData.rating,
          returns_1yr: fundData.returns1yr || 0,
          returns_3yr: fundData.returns3yr || 0,
          returns_5yr: fundData.returns5yr || 0,
          min_sip: fundData.minSip,
          min_lumpsum: fundData.minLumpsum,
        } as Record<string, any>,
      },
    ]);

    await prisma.mutualFund.update({
      where: { id: fund.id },
      data: { pineconeId: fund.id },
    });

    console.log(`✓ Processed: ${fundData.schemeName}`);
  }

  console.log("Seeding completed!");
}

seedData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
