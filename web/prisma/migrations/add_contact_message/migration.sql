-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('normal', 'admin');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('funding', 'completed', 'failed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "userType" "UserType" NOT NULL DEFAULT 'normal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3) NOT NULL,
    "contactInfo" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "creatorAddress" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "minimumContribution" DOUBLE PRECISION NOT NULL,
    "targetAmount" DOUBLE PRECISION NOT NULL,
    "contributorsCount" INTEGER NOT NULL DEFAULT 0,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "commission" DOUBLE PRECISION,
    "gasCost" DOUBLE PRECISION,
    "status" "CampaignStatus" NOT NULL DEFAULT 'funding',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supplement" BYTEA,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "contributorAddress" TEXT NOT NULL,
    "campaignAddress" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "gasCost" DOUBLE PRECISION,
    "note" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "campaignAddress" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "gasCost" DOUBLE PRECISION,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "is_finalized" BOOLEAN NOT NULL DEFAULT false,
    "approvalCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "voterAddress" TEXT NOT NULL,
    "gasCost" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Finalization" (
    "id" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "fundSeekerAddr" TEXT NOT NULL,
    "campaignAddr" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "gasCost" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Finalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_contractAddress_key" ON "Campaign"("contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Contribution_txHash_key" ON "Contribution"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "Request_txHash_key" ON "Request"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "Request_campaignAddress_reason_amount_key" ON "Request"("campaignAddress", "reason", "amount");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_txHash_key" ON "Vote"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_requestId_voterAddress_key" ON "Vote"("requestId", "voterAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Finalization_txHash_key" ON "Finalization"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "Finalization_requestId_key" ON "Finalization"("requestId");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_creatorAddress_fkey" FOREIGN KEY ("creatorAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_contributorAddress_fkey" FOREIGN KEY ("contributorAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_campaignAddress_fkey" FOREIGN KEY ("campaignAddress") REFERENCES "Campaign"("contractAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_campaignAddress_fkey" FOREIGN KEY ("campaignAddress") REFERENCES "Campaign"("contractAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voterAddress_fkey" FOREIGN KEY ("voterAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finalization" ADD CONSTRAINT "Finalization_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finalization" ADD CONSTRAINT "Finalization_fundSeekerAddr_fkey" FOREIGN KEY ("fundSeekerAddr") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finalization" ADD CONSTRAINT "Finalization_campaignAddr_fkey" FOREIGN KEY ("campaignAddr") REFERENCES "Campaign"("contractAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

