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
    // Interceptor runs AFTER guards, so request.user should be available

    console.log("TenantInterceptor - Request user:", request.user);
    console.log("TenantInterceptor - Request headers:", request.headers?.authorization?.substring(0, 20) + "...");

    if (request.user) {
      if (request.user.tenantId) {
        request.tenantId = request.user.tenantId;
        console.log(
          "✅ TenantInterceptor - Tenant ID extracted:",
          request.tenantId,
          "for user:",
          request.user.email
        );
      } else {
        // If user exists but no tenantId, log warning but don't throw error here
        // Let the controller handle it
        console.warn(
          "⚠️ TenantInterceptor - No tenantId found for user:",
          request.user
        );
        // Try to get from request if it was set elsewhere
        if (!request.tenantId) {
          request.tenantId = request.user.tenantId || null;
        }
      }
    } else {
      // User not authenticated - this is fine for public routes
      // Guards will handle authentication
      console.log("TenantInterceptor - No user found (might be public route)");
    }

    return next.handle();
  }
}
