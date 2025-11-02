import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdvancedThrottlerGuard extends ThrottlerGuard {
  constructor(private configService: ConfigService) {
    super();
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Use user ID if authenticated, otherwise IP
    const userId = req.user?.id;
    const ip = req.ip || req.connection.remoteAddress;
    
    return userId ? `user:${userId}` : `ip:${ip}`;
  }

  protected getThrottlerSuffix(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const { method, route } = request;
    
    // Different limits for different endpoints
    const endpoint = route?.path || request.url;
    
    if (endpoint.includes('/auth/login')) return 'auth';
    if (endpoint.includes('/payments/')) return 'payments';
    if (method === 'POST') return 'write';
    
    return 'default';
  }

  protected async throwThrottlingException(context: ExecutionContext): Promise<void> {
    const request = context.switchToHttp().getRequest();
    const tracker = await this.getTracker(request);
    
    // Log rate limit violations
    console.warn(`Rate limit exceeded for ${tracker} on ${request.url}`);
    
    throw new ThrottlerException('Rate limit exceeded. Please try again later.');
  }
}