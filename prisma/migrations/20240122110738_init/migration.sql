-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER', 'OPERATOR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('DISABLED', 'ENABLED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ScheduleInterval" AS ENUM ('REPEAT', 'NOT_REPEAT');

-- CreateEnum
CREATE TYPE "EtlexecStatus" AS ENUM ('QUEUED', 'FAILED', 'SUCCESS', 'SUMMARY');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'PAID');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "status" "UserStatus" DEFAULT 'ENABLED',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "roles" "UserRole"[] DEFAULT ARRAY['USER']::"UserRole"[],
    "profile_image" TEXT,
    "job_description" TEXT,
    "refresh_hash" TEXT,

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
    "mapping_task_name" TEXT NOT NULL,
    "job_task_name" TEXT,
    "user_id" TEXT,
    "username" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "etlexec_status" "EtlexecStatus" NOT NULL,
    "status" "JobStatus" NOT NULL,
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
    "interval" "ScheduleInterval",
    "frequency" INTEGER,
    "repeat" BOOLEAN DEFAULT false,
    "hourlyFrequencyKill" BOOLEAN DEFAULT false,
    "jobBatchId" TEXT NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("scheduleId")
);

-- CreateTable
CREATE TABLE "tasks" (
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
    "source" TEXT,
    "target" TEXT,
    "createStage" TEXT,
    "schedule" TIMESTAMP(3),
    "updated" TIMESTAMP(3),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conn-params" (
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

    CONSTRAINT "conn-params_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connections" (
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

    CONSTRAINT "connections_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "image_url" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "conn-params_agentId_key" ON "conn-params"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "connections_agentId_key" ON "connections"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToPost_AB_unique" ON "_CategoryToPost"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToPost_B_index" ON "_CategoryToPost"("B");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_jobBatchId_fkey" FOREIGN KEY ("jobBatchId") REFERENCES "jobs"("batchid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conn-params" ADD CONSTRAINT "conn-params_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "connections"("agentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connections" ADD CONSTRAINT "connections_runtimeEnvironmentId_fkey" FOREIGN KEY ("runtimeEnvironmentId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToPost" ADD CONSTRAINT "_CategoryToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToPost" ADD CONSTRAINT "_CategoryToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
