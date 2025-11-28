import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create Tenant A
  const tenantA = await prisma.tenant.upsert({
    where: { id: "tenant-a-id" },
    update: {},
    create: {
      id: "tenant-a-id",
      name: "Tenant A",
    },
  });
  console.log("✅ Created Tenant A:", tenantA);

  // Create Tenant B
  const tenantB = await prisma.tenant.upsert({
    where: { id: "tenant-b-id" },
    update: {},
    create: {
      id: "tenant-b-id",
      name: "Tenant B",
    },
  });
  console.log("✅ Created Tenant B:", tenantB);

  console.log("\n✨ Seed completed successfully!");
  console.log("\n💡 Instructions:");
  console.log("  - Only tenants have been created (Tenant A and Tenant B)");
  console.log("  - Users will be created when they sign up through the application");
  console.log("  - Admin users can see all users in their tenant");
  console.log("  - Normal users can only see their own data");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
