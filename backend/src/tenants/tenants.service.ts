import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async create(name: string) {
    return this.prisma.tenant.create({
      data: { name },
    });
  }

  async findById(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
    });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async findAll() {
    try {
      return await this.prisma.tenant.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      // If table doesn't exist, return empty array instead of throwing
      if (error.message?.includes("does not exist") || error.code === "42P01") {
        console.warn(
          "Tenants table does not exist. Please run migrations: npm run prisma:migrate"
        );
        return [];
      }
      throw error;
    }
  }

  async findByName(name: string) {
    try {
      // Case-insensitive search for PostgreSQL
      const tenants = await this.prisma.tenant.findMany({
        where: {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
      });
      return tenants.length > 0 ? tenants[0] : null;
    } catch (error) {
      // If table doesn't exist, return null instead of throwing
      if (error.message?.includes("does not exist") || error.code === "42P01") {
        console.warn(
          "Tenants table does not exist. Please run migrations: npm run prisma:migrate"
        );
        return null;
      }
      throw error;
    }
  }
}
