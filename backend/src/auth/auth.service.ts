import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { TenantsService } from "../tenants/tenants.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tenantsService: TenantsService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role || "user",
    };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        tenantId: user.tenantId,
        role: user.role || "user",
      },
    };
  }

  async signup(createUserDto: CreateUserDto) {
    try {
      // Validate tenant exists - try by ID first, then by name
      let tenant;
      const tenantInput = createUserDto.tenantId?.trim();

      if (!tenantInput) {
        throw new BadRequestException(
          "Tenant ID is required. Please select a tenant from the dropdown."
        );
      }

      try {
        tenant = await this.tenantsService.findById(tenantInput);
      } catch (error) {
        // If not found by ID, try to find by name (case-insensitive)
        tenant = await this.tenantsService.findByName(tenantInput);
        if (tenant) {
          // Replace tenantId with actual ID
          createUserDto.tenantId = tenant.id;
        } else {
          // Get all available tenants for better error message
          const allTenants = await this.tenantsService.findAll();
          const tenantOptions =
            allTenants.length > 0
              ? allTenants.map((t) => `"${t.name}"`).join(", ")
              : "No tenants available";

          throw new BadRequestException(
            `Tenant "${tenantInput}" does not exist. Available tenants: ${tenantOptions}. Please run: npm run prisma:seed`
          );
        }
      }

      if (!tenant) {
        throw new BadRequestException(
          `Tenant "${tenantInput}" does not exist. Please select a tenant from the dropdown.`
        );
      }

      const existingUser = await this.usersService.findByEmail(
        createUserDto.email
      );
      if (existingUser) {
        throw new UnauthorizedException("User with this email already exists");
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return this.login(user);
    } catch (error) {
      // Re-throw HttpExceptions as-is
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      // Wrap unexpected errors
      throw new BadRequestException(
        `Signup failed: ${error.message || "Unknown error occurred"}. Please check backend logs.`
      );
    }
  }
}
