import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: createUserDto,
        select: {
          id: true,
          email: true,
          tenantId: true,
          createdAt: true,
        },
      });
    } catch (error) {
      console.error("User creation error:", error);
      // Handle Prisma unique constraint violation (duplicate email)
      if (error.code === "P2002") {
        throw new Error("User with this email already exists");
      }
      // Handle foreign key constraint violation (invalid tenant ID)
      if (error.code === "P2003") {
        throw new Error("Invalid tenant ID. Tenant does not exist.");
      }
      throw error;
    }
  }

  async findByEmail(email: string, tenantId?: string) {
    const where: any = { email };
    if (tenantId) {
      where.tenantId = tenantId;
    }
    return this.prisma.user.findFirst({
      where,
    });
  }

  async findById(
    id: string,
    tenantId: string,
    currentUserId: string,
    currentUserRole: string
  ) {
    // Admin can see any user in their tenant, normal users can only see themselves
    if (currentUserRole !== "admin" && id !== currentUserId) {
      throw new ForbiddenException("Access denied. You can only view your own data.");
    }

    const where: any = { id, tenantId }; // Always filter by tenantId for security

    const user = await this.prisma.user.findFirst({
      where,
      select: {
        id: true,
        email: true,
        tenantId: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ForbiddenException("User not found or access denied");
    }

    return user;
  }

  async findAll(
    tenantId: string,
    currentUserId: string,
    currentUserRole: string
  ) {
    console.log("🔍 UsersService.findAll - Filtering by tenantId:", tenantId);
    console.log("🔍 Current user ID:", currentUserId);
    console.log("🔍 Current user role:", currentUserRole);

    // Verify tenantId is not empty
    if (!tenantId || tenantId.trim() === "") {
      console.error("❌ Invalid tenantId provided:", tenantId);
      return [];
    }

    let users;

    if (currentUserRole === "admin") {
      // Admin can see all users in their tenant
      console.log("👑 Admin user - returning all users for tenant:", tenantId);
      users = await this.prisma.user.findMany({
        where: { tenantId },
        select: {
          id: true,
          email: true,
          tenantId: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Normal users can only see themselves
      console.log("👤 Normal user - returning only own data");
      const user = await this.prisma.user.findFirst({
        where: { id: currentUserId, tenantId },
        select: {
          id: true,
          email: true,
          tenantId: true,
          createdAt: true,
        },
      });
      users = user ? [user] : [];
    }

    console.log(
      `✅ Found ${users.length} users for tenant ${tenantId}:`,
      users.map((u) => u.email)
    );

    // Add name field extracted from email (before @) for display
    return users.map((user) => ({
      ...user,
      name:
        user.email.split("@")[0].charAt(0).toUpperCase() +
        user.email.split("@")[0].slice(1),
    }));
  }
}
