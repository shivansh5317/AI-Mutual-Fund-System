export interface MutualFundData {
  schemeName: string;
  minSip: number;
  minLumpsum: number;
  expenseRatio: number;
  fundSizeCr: number;
  fundAgeYr: number;
  fundManager: string;
  sortino: number | null;
  alpha: number | null;
  sd: number | null;
  beta: number | null;
  sharpe: number | null;
  riskLevel: number;
  amcName: string;
  rating: number;
  category: string;
  subCategory: string;
  returns1yr: number | null;
  returns3yr: number | null;
  returns5yr: number | null;
}

export interface MutualFund extends MutualFundData {
  id: string;
  pineconeId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CSVRecord {
  scheme_name: string;
  min_sip: string;
  min_lumpsum: string;
  expense_ratio: string;
  fund_size_cr: string;
  fund_age_yr: string;
  fund_manager: string;
  sortino: string;
  alpha: string;
  sd: string;
  beta: string;
  sharpe: string;
  risk_level: string;
  amc_name: string;
  rating: string;
  category: string;
  sub_category: string;
  returns_1yr: string;
  returns_3yr: string;
  returns_5yr: string;
}

export interface RecommendationInput {
  amcName?: string;
  category?: string;
  amountInvested: number;
  tenure: number;
  investmentType?: string;
}

export interface FundWithProjection {
  id: string;
  schemeName: string;
  amcName: string;
  category: string;
  rating: number;
  riskLevel: number;
  returns1yr: number | null;
  returns3yr: number | null;
  returns5yr: number | null;
  expectedReturn: number;
  projectedValue: number;
  score: number;
}

export interface PineconeIndex {
  name: string;
}

export interface PineconeMetadata {
  text: string;
  scheme_name: string;
  amc_name: string;
  category: string;
  sub_category: string;
  risk_level: number;
  rating: number;
  returns_1yr: number;
  returns_3yr: number;
  returns_5yr: number;
  min_sip: number;
  min_lumpsum: number;
}

export interface AnalyticsData {
  totalFunds: number;
  byCategory: Array<{ category: string; _count: number }>;
  topAMCs: Array<{ amcName: string; _count: number }>;
  avgReturns: {
    returns1yr: number | null;
    returns3yr: number | null;
    returns5yr: number | null;
  };
}

export interface FiltersData {
  amcs: string[];
  categories: Record<string, string[]>;
}