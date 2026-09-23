-- CreateTable
CREATE TABLE "MutualFund" (
    "id" TEXT NOT NULL,
    "schemeName" TEXT NOT NULL,
    "minSip" DOUBLE PRECISION NOT NULL,
    "minLumpsum" DOUBLE PRECISION NOT NULL,
    "expenseRatio" DOUBLE PRECISION NOT NULL,
    "fundSizeCr" DOUBLE PRECISION NOT NULL,
    "fundAgeYr" DOUBLE PRECISION NOT NULL,
    "fundManager" TEXT NOT NULL,
    "sortino" DOUBLE PRECISION,
    "alpha" DOUBLE PRECISION,
    "sd" DOUBLE PRECISION,
    "beta" DOUBLE PRECISION,
    "sharpe" DOUBLE PRECISION,
    "riskLevel" INTEGER NOT NULL,
    "amcName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "subCategory" TEXT NOT NULL,
    "returns1yr" DOUBLE PRECISION,
    "returns3yr" DOUBLE PRECISION,
    "returns5yr" DOUBLE PRECISION,
    "pineconeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MutualFund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "avatarURL" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MutualFund_pineconeId_key" ON "MutualFund"("pineconeId");

-- CreateIndex
CREATE INDEX "MutualFund_amcName_idx" ON "MutualFund"("amcName");

-- CreateIndex
CREATE INDEX "MutualFund_category_idx" ON "MutualFund"("category");

-- CreateIndex
CREATE INDEX "MutualFund_riskLevel_idx" ON "MutualFund"("riskLevel");

-- CreateIndex
CREATE INDEX "MutualFund_rating_idx" ON "MutualFund"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
