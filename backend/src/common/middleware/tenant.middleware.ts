import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract tenant_id from JWT payload (set by JwtStrategy)
    if (req.user && (req.user as any).tenantId) {
      (req as any).tenantId = (req.user as any).tenantId;
    }
    next();
  }
}

