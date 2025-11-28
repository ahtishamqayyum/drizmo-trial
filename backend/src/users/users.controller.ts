import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantId } from "../common/decorators/tenant.decorator";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@TenantId() tenantId: string, @Request() req) {
    console.log("🔍 UsersController.findAll - Request received");
    console.log("🔍 Tenant ID from decorator:", tenantId);
    console.log("🔍 Request user:", req.user);
    console.log("🔍 Request tenantId:", req.tenantId);

    if (!tenantId) {
      console.error("❌ Tenant ID is missing!");
      throw new UnauthorizedException("Tenant ID is required");
    }

    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role || "user";

    console.log(
      "✅ UsersController.findAll - Tenant ID:",
      tenantId,
      "User:",
      req.user?.email,
      "Role:",
      currentUserRole
    );
    const users = await this.usersService.findAll(
      tenantId,
      currentUserId,
      currentUserRole
    );
    console.log(`✅ Found ${users.length} users for tenant ${tenantId}`);
    console.log("✅ Users data:", users);
    return users;
  }

  @Get(":id")
  async findOne(
    @Param("id") id: string,
    @TenantId() tenantId: string,
    @Request() req
  ) {
    if (!tenantId) {
      throw new UnauthorizedException("Tenant ID is required");
    }

    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role || "user";

    return this.usersService.findById(
      id,
      tenantId,
      currentUserId,
      currentUserRole
    );
  }

  @Get("profile/me")
  async getProfile(@Request() req, @TenantId() tenantId: string) {
    if (!tenantId) {
      throw new UnauthorizedException("Tenant ID is required");
    }
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role || "user";
    // User can always see their own profile
    return this.usersService.findById(
      req.user.id,
      tenantId,
      currentUserId,
      currentUserRole
    );
  }
}
