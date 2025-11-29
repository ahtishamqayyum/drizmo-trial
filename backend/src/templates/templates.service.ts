import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async create(createTemplateDto: CreateTemplateDto, tenantId: string) {
    try {
      return await this.prisma.template.create({
        data: {
          ...createTemplateDto,
          tenantId,
        },
        select: {
          id: true,
          title: true,
          items: true,
          tenantId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error('Template creation error:', error);
      // Handle foreign key constraint violation (invalid tenant ID)
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Invalid tenant ID. Tenant does not exist.',
        );
      }
      throw error;
    }
  }

  async findAll(tenantId: string) {
    console.log('🔍 TemplatesService.findAll - Filtering by tenantId:', tenantId);

    // Verify tenantId is not empty
    if (!tenantId || tenantId.trim() === '') {
      console.error('❌ Invalid tenantId provided:', tenantId);
      return [];
    }

    const templates = await this.prisma.template.findMany({
      where: {
        tenantId,
        deletedAt: null, // Only show non-deleted templates
      },
      select: {
        id: true,
        title: true,
        items: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(
      `✅ Found ${templates.length} templates for tenant ${tenantId}`,
    );

    return templates;
  }

  async findOne(id: string, tenantId: string) {
    const template = await this.prisma.template.findFirst({
      where: {
        id,
        tenantId, // Always filter by tenantId for security
        deletedAt: null, // Don't return deleted templates
      },
      select: {
        id: true,
        title: true,
        items: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!template) {
      throw new NotFoundException(
        'Template not found or access denied',
      );
    }

    return template;
  }

  async update(
    id: string,
    updateTemplateDto: UpdateTemplateDto,
    tenantId: string,
  ) {
    // First verify the template exists and belongs to the tenant
    const existingTemplate = await this.prisma.template.findFirst({
      where: {
        id,
        tenantId, // Critical: Only allow update if tenant_id matches
        deletedAt: null, // Don't allow updating deleted templates
      },
    });

    if (!existingTemplate) {
      throw new NotFoundException(
        'Template not found or access denied. You can only update templates from your tenant.',
      );
    }

    return await this.prisma.template.update({
      where: { id },
      data: updateTemplateDto,
      select: {
        id: true,
        title: true,
        items: true,
        tenantId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string, tenantId: string) {
    // First verify the template exists and belongs to the tenant
    const existingTemplate = await this.prisma.template.findFirst({
      where: {
        id,
        tenantId, // Critical: Only allow soft delete if tenant_id matches
        deletedAt: null, // Don't allow deleting already deleted templates
      },
    });

    if (!existingTemplate) {
      throw new NotFoundException(
        'Template not found or access denied. You can only delete templates from your tenant.',
      );
    }

    // Soft delete: Set deletedAt timestamp instead of deleting the record
    return await this.prisma.template.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        items: true,
        tenantId: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

