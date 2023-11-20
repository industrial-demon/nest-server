-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'PAID');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "status" TEXT DEFAULT 'ACTIVATED',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" DEFAULT 'USER',
    "refreshHash" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "published" BOOLEAN DEFAULT false,
    "authorId" TEXT NOT NULL,
    "categoryIDs" TEXT[],

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "batchid" TEXT NOT NULL,
    "mappingTaskName" TEXT NOT NULL,
    "jobTaskName" TEXT,
    "userId" TEXT,
    "username" TEXT NOT NULL,
    "startedTstamp" TIMESTAMP(3) NOT NULL,
    "updatedTstamp" TIMESTAMP(3) NOT NULL,
    "completedTstamp" TIMESTAMP(3),
    "etlexecStatus" TEXT NOT NULL,
    "deleteFlag" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("batchid")
);

-- CreateTable
CREATE TABLE "schedules" (
    "scheduleId" SERIAL NOT NULL,
    "scheduleName" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "timezone" TEXT,
    "interval" TEXT,
    "frequency" INTEGER,
    "repeat" BOOLEAN DEFAULT false,
    "hourlyFrequencyKill" BOOLEAN DEFAULT false,
    "jobBatchId" TEXT NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("scheduleId")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "mappingTaskId" TEXT NOT NULL,
    "mappingName" TEXT NOT NULL,
    "srcConnectionName" TEXT NOT NULL,
    "targetConnectionName" TEXT NOT NULL,
    "createdBy" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "srcConnectorType" TEXT NOT NULL,
    "srcConnectionObject" TEXT NOT NULL,
    "targetConnectorType" TEXT,
    "targetConnectionObject" TEXT,
    "updatedTimestamp" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "createStage" TEXT NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnParams" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "agentGroupId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "authentication_TYPE" TEXT,
    "useEC2RoletoAssumeRole" TEXT,
    "federatedUsername" TEXT,
    "samlidentityProviderARN" TEXT,
    "credentialProfileFilePath" TEXT,
    "otherAuthenticationType" TEXT,
    "accessKey" TEXT,
    "folderPath" TEXT,
    "profileName" TEXT,
    "iamroleARN" TEXT,
    "idpSsoUrl" TEXT,
    "secretKey" TEXT,
    "federatedSSOIdP" TEXT,
    "regionName" TEXT,
    "roleARN" TEXT,
    "s3RegionName" TEXT,

    CONSTRAINT "ConnParams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "orgId" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "agentId" TEXT,
    "runtimeEnvironmentId" TEXT,
    "instanceDisplayName" TEXT,
    "host" TEXT,
    "database" TEXT,
    "codepage" TEXT,
    "adjustedJdbcHostName" TEXT,
    "shortDescription" TEXT,
    "port" TEXT,
    "username" TEXT,
    "password" TEXT,
    "createTime" TIMESTAMP(3),
    "updateTime" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "status" "InvoiceStatus" NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToPost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_password_key" ON "users"("password");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_jobBatchId_key" ON "schedules"("jobBatchId");

-- CreateIndex
CREATE UNIQUE INDEX "ConnParams_agentId_key" ON "ConnParams"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_agentId_key" ON "Connection"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToPost_AB_unique" ON "_CategoryToPost"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToPost_B_index" ON "_CategoryToPost"("B");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_jobBatchId_fkey" FOREIGN KEY ("jobBatchId") REFERENCES "jobs"("batchid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnParams" ADD CONSTRAINT "ConnParams_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Connection"("agentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToPost" ADD CONSTRAINT "_CategoryToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToPost" ADD CONSTRAINT "_CategoryToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
