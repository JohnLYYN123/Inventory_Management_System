-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Internal', 'External', 'Admin');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Available', 'Unavailable', 'Pending', 'Retired');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('Completed', 'Denied', 'Pending');

-- CreateEnum
CREATE TYPE "Activity" AS ENUM ('Borrow', 'Return', 'Retired');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT,
    "location" TEXT,
    "displayName" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceType" (
    "id" SERIAL NOT NULL,
    "deviceType" TEXT NOT NULL,
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "deviceName" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3) NOT NULL,
    "deviceTypeId" INTEGER NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "requestTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "RequestStatus" NOT NULL,
    "adminComment" TEXT,
    "requestDetail" TEXT,
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3) NOT NULL,
    "requestorId" INTEGER NOT NULL,
    "deviceId" INTEGER NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "activity" "Activity" NOT NULL,
    "activityTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file" TEXT,
    "comment" TEXT,
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3) NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "executorId" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceType_deviceType_key" ON "DeviceType"("deviceType");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_deviceTypeId_fkey" FOREIGN KEY ("deviceTypeId") REFERENCES "DeviceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_requestorId_fkey" FOREIGN KEY ("requestorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_executorId_fkey" FOREIGN KEY ("executorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
