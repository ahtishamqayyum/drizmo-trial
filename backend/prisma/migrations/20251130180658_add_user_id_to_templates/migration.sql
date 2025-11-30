/*
  Warnings:

  - Added the required column `user_id` to the `templates` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Add user_id column as nullable first
ALTER TABLE "templates" ADD COLUMN "user_id" TEXT;

-- Step 2: Update existing templates with a default user from their tenant
-- For each template, assign the first user from the same tenant (preferably admin, otherwise any user)
UPDATE "templates" t
SET "user_id" = (
  SELECT u.id 
  FROM "users" u 
  WHERE u."tenant_id" = t."tenant_id" 
  ORDER BY CASE WHEN u.role = 'admin' THEN 0 ELSE 1 END
  LIMIT 1
)
WHERE t."user_id" IS NULL;

-- Step 3: Make user_id required (NOT NULL)
ALTER TABLE "templates" ALTER COLUMN "user_id" SET NOT NULL;

-- Step 4: Add foreign key constraint
ALTER TABLE "templates" ADD CONSTRAINT "templates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
