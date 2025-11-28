-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- Create a default tenant for existing users (if any)
INSERT INTO "tenants" ("id", "name", "created_at", "updated_at")
VALUES ('default-tenant-id', 'Default Tenant', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Update existing users to use default tenant (if any exist)
UPDATE "users" SET "tenant_id" = 'default-tenant-id' 
WHERE EXISTS (SELECT 1 FROM "users");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

