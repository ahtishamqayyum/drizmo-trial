import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");
  console.log("");

  // Create Tenant A
  const tenantA = await prisma.tenant.upsert({
    where: { id: "tenant-a-id" },
    update: {},
    create: {
      id: "tenant-a-id",
      name: "Tenant A",
    },
  });
  console.log("✅ Created Tenant A:", tenantA.name);

  // Create Tenant B
  const tenantB = await prisma.tenant.upsert({
    where: { id: "tenant-b-id" },
    update: {},
    create: {
      id: "tenant-b-id",
      name: "Tenant B",
    },
  });
  console.log("✅ Created Tenant B:", tenantB.name);

  // Create test users for Tenant A
  const hashedPasswordA = await bcrypt.hash("password123", 10);
  
  const userA1 = await prisma.user.upsert({
    where: { email: "adminA@test.com" },
    update: {},
    create: {
      email: "adminA@test.com",
      password: hashedPasswordA,
      tenantId: tenantA.id,
      role: "admin",
    },
  });
  console.log("✅ Created Admin User for Tenant A:", userA1.email);

  const userA2 = await prisma.user.upsert({
    where: { email: "userA@test.com" },
    update: {},
    create: {
      email: "userA@test.com",
      password: hashedPasswordA,
      tenantId: tenantA.id,
      role: "user",
    },
  });
  console.log("✅ Created Regular User for Tenant A:", userA2.email);

  // Create test users for Tenant B
  const userB1 = await prisma.user.upsert({
    where: { email: "adminB@test.com" },
    update: {},
    create: {
      email: "adminB@test.com",
      password: hashedPasswordA,
      tenantId: tenantB.id,
      role: "admin",
    },
  });
  console.log("✅ Created Admin User for Tenant B:", userB1.email);

  const userB2 = await prisma.user.upsert({
    where: { email: "userB@test.com" },
    update: {},
    create: {
      email: "userB@test.com",
      password: hashedPasswordA,
      tenantId: tenantB.id,
      role: "user",
    },
  });
  console.log("✅ Created Regular User for Tenant B:", userB2.email);

  // Create sample templates
  const template1 = await prisma.template.upsert({
    where: { id: "template-1-id" },
    update: {},
    create: {
      id: "template-1-id",
      title: "Sample Template 1",
      items: JSON.stringify({ item1: "value1", item2: "value2" }),
      tenantId: tenantA.id,
      userId: userA1.id,
    },
  });
  console.log("✅ Created Template 1:", template1.title);

  const template2 = await prisma.template.upsert({
    where: { id: "template-2-id" },
    update: {},
    create: {
      id: "template-2-id",
      title: "Sample Template 2",
      items: JSON.stringify({ item3: "value3", item4: "value4" }),
      tenantId: tenantA.id,
      userId: userA2.id,
    },
  });
  console.log("✅ Created Template 2:", template2.title);

  console.log("");
  console.log("✨ Seed completed successfully!");
  console.log("");
  console.log("📋 Test Users Created:");
  console.log("");
  console.log("   Tenant A:");
  console.log("     Admin:  adminA@test.com / password123");
  console.log("     User:   userA@test.com / password123");
  console.log("");
  console.log("   Tenant B:");
  console.log("     Admin:  adminB@test.com / password123");
  console.log("     User:   userB@test.com / password123");
  console.log("");
  console.log("💡 You can now view this data in pgAdmin:");
  console.log("   - Tables: tenants, users, templates");
  console.log("   - Database: drizmo_db");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
