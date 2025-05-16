/*
  Warnings:

  - The `status` column on the `role_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RoleRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- DropIndex
DROP INDEX "reactions_postId_commentId_idx";

-- AlterTable
ALTER TABLE "role_requests" DROP COLUMN "status",
ADD COLUMN     "status" "RoleRequestStatus" NOT NULL DEFAULT 'PENDING';
