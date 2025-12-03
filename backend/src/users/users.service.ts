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
      if (error.code === "P2002") {
        throw new Error("User with this email already exists");
      }
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
    if (!tenantId || tenantId.trim() === "") {
      return [];
    }

    let users;

    if (currentUserRole === "admin") {
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

    return users.map((user) => ({
      ...user,
      name:
        user.email.split("@")[0].charAt(0).toUpperCase() +
        user.email.split("@")[0].slice(1),
    }));
  }

  async updatePassword(userId: string, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
