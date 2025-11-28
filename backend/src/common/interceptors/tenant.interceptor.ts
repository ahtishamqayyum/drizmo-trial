import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Extract tenant_id from JWT payload (set by JwtStrategy)
    // This ensures tenant_id is always available on the request object
    if (request.user && request.user.tenantId) {
      request.tenantId = request.user.tenantId;
      console.log(
        "TenantInterceptor - Tenant ID extracted:",
        request.tenantId,
        "for user:",
        request.user.email
      );
    } else if (request.user) {
      // If user exists but no tenantId, throw error
      console.error(
        "TenantInterceptor - No tenantId found for user:",
        request.user
      );
      throw new UnauthorizedException("Tenant ID not found in token");
    }

    return next.handle();
  }
}
