import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/tenant.decorator';

@Controller('templates')
@UseGuards(JwtAuthGuard)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  async create(
    @Body() createTemplateDto: CreateTemplateDto,
    @TenantId() tenantId: string,
    @Request() req,
  ) {
    const finalTenantId = tenantId || req.tenantId || req.user?.tenantId;
    const userId = req.user?.id;

    if (!finalTenantId) {
      throw new UnauthorizedException('Tenant ID is required. Please login again.');
    }

    if (!userId) {
      throw new UnauthorizedException('User ID is required. Please login again.');
    }

    return this.templatesService.create(createTemplateDto, finalTenantId, userId);
  }

  @Get()
  async findAll(@TenantId() tenantId: string, @Request() req) {
    const finalTenantId = tenantId || req.tenantId || req.user?.tenantId;
    const userRole = req.user?.role || 'user';
    const userId = req.user?.id;

    if (!finalTenantId) {
      throw new UnauthorizedException('Tenant ID is required. Please login again.');
    }

    if (!userId) {
      throw new UnauthorizedException('User ID is required. Please login again.');
    }

    return this.templatesService.findAll(finalTenantId, userRole, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @TenantId() tenantId: string, @Request() req) {
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is required');
    }

    const userRole = req.user?.role || 'user';
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }

    return this.templatesService.findOne(id, tenantId, userRole, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
    @TenantId() tenantId: string,
    @Request() req,
  ) {
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is required');
    }

    const userRole = req.user?.role || 'user';
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }

    return this.templatesService.update(id, updateTemplateDto, tenantId, userRole, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @TenantId() tenantId: string, @Request() req) {
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is required');
    }

    const userRole = req.user?.role || 'user';
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }

    return this.templatesService.remove(id, tenantId, userRole, userId);
  }
}
