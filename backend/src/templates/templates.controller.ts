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
    console.log('🔍 TemplatesController.create - Request received');
    console.log('🔍 Request user:', req.user);
    console.log('🔍 Tenant ID from decorator:', tenantId);
    console.log('🔍 Request tenantId:', req.tenantId);

    // Fallback: Try to get tenantId from request if decorator didn't work
    const finalTenantId = tenantId || req.tenantId || req.user?.tenantId;

    if (!finalTenantId) {
      console.error('❌ Tenant ID is missing!');
      console.error('Request object:', {
        user: req.user,
        tenantId: req.tenantId,
        headers: req.headers,
      });
      throw new UnauthorizedException('Tenant ID is required. Please login again.');
    }

    console.log(
      '✅ TemplatesController.create - Creating template for tenant:',
      finalTenantId,
    );
    return this.templatesService.create(createTemplateDto, finalTenantId);
  }

  @Get()
  async findAll(@TenantId() tenantId: string, @Request() req) {
    console.log('🔍 TemplatesController.findAll - Request received');
    console.log('🔍 Request user:', req.user);
    console.log('🔍 Tenant ID from decorator:', tenantId);
    console.log('🔍 Request tenantId:', req.tenantId);

    // Fallback: Try to get tenantId from request if decorator didn't work
    const finalTenantId = tenantId || req.tenantId || req.user?.tenantId;

    if (!finalTenantId) {
      console.error('❌ Tenant ID is missing!');
      console.error('Request object:', {
        user: req.user,
        tenantId: req.tenantId,
        headers: req.headers,
      });
      throw new UnauthorizedException('Tenant ID is required. Please login again.');
    }

    console.log(
      '✅ TemplatesController.findAll - Fetching templates for tenant:',
      finalTenantId,
    );
    return this.templatesService.findAll(finalTenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is required');
    }

    return this.templatesService.findOne(id, tenantId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
    @TenantId() tenantId: string,
  ) {
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is required');
    }

    console.log(
      `✅ TemplatesController.update - Updating template ${id} for tenant:`,
      tenantId,
    );
    return this.templatesService.update(id, updateTemplateDto, tenantId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @TenantId() tenantId: string) {
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is required');
    }

    console.log(
      `✅ TemplatesController.remove - Soft deleting template ${id} for tenant:`,
      tenantId,
    );
    return this.templatesService.remove(id, tenantId);
  }
}
