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

  async create(createTemplateDto: CreateTemplateDto, tenantId: string, userId: string) {
    try {
      return await this.prisma.template.create({
        data: {
          ...createTemplateDto,
          tenantId,
          userId,
        },
        select: {
          id: true,
          title: true,
          items: true,
          tenantId: true,
          userId: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Invalid tenant ID or user ID. Tenant or user does not exist.',
        );
      }
      throw error;
    }
  }

  async findAll(tenantId: string, userRole: string = 'user', userId: string) {
    if (!tenantId || tenantId.trim() === '') {
      return [];
    }

    const where: any = {
      tenantId,
      deletedAt: null,
    };

    if (userRole !== 'admin') {
      where.userId = userId;
    }

    return await this.prisma.template.findMany({
      where,
      select: {
        id: true,
        title: true,
        items: true,
        tenantId: true,
        userId: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string, userRole: string, userId: string) {
    const where: any = {
      id,
      tenantId, // Always filter by tenantId for security
      deletedAt: null, // Don't return deleted templates
    };

    // Regular users can only access their own templates
    if (userRole !== 'admin') {
      where.userId = userId;
    }

    const template = await this.prisma.template.findFirst({
      where,
      select: {
        id: true,
        title: true,
        items: true,
        tenantId: true,
        userId: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
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
    userRole: string,
    userId: string,
  ) {
    const where: any = {
      id,
      tenantId, // Critical: Only allow update if tenant_id matches
      deletedAt: null, // Don't allow updating deleted templates
    };

    // Regular users can only update their own templates
    if (userRole !== 'admin') {
      where.userId = userId;
    }

    // First verify the template exists and user has access
    const existingTemplate = await this.prisma.template.findFirst({
      where,
    });

    if (!existingTemplate) {
      throw new NotFoundException(
        userRole === 'admin'
          ? 'Template not found or access denied. You can only update templates from your tenant.'
          : 'Template not found or access denied. You can only update your own templates.',
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
        userId: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string, tenantId: string, userRole: string, userId: string) {
    const where: any = {
      id,
      tenantId, // Critical: Only allow soft delete if tenant_id matches
      deletedAt: null, // Don't allow deleting already deleted templates
    };

    // Regular users can only delete their own templates
    if (userRole !== 'admin') {
      where.userId = userId;
    }

    // First verify the template exists and user has access
    const existingTemplate = await this.prisma.template.findFirst({
      where,
    });

    if (!existingTemplate) {
      throw new NotFoundException(
        userRole === 'admin'
          ? 'Template not found or access denied. You can only delete templates from your tenant.'
          : 'Template not found or access denied. You can only delete your own templates.',
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
        userId: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

