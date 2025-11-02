import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip, headers } = request;
    const userAgent = headers['user-agent'];
    const requestId = headers['x-request-id'];
    
    const startTime = Date.now();

    return next.handle().pipe(
      tap(async (data) => {
        const responseTime = Date.now() - startTime;
        
        // Log successful requests
        this.logger.log(`${method} ${url} - ${responseTime}ms [${requestId}]`);

        // Audit sensitive operations
        if (this.isSensitiveOperation(method, url)) {
          await this.createAuditLog({
            userId: user?.id,
            action: `${method}_${this.extractResource(url)}`,
            resource: url,
            details: { responseTime, success: true },
            ipAddress: ip,
            userAgent,
          });
        }
      }),
      catchError(async (error) => {
        const responseTime = Date.now() - startTime;
        
        // Log errors
        this.logger.error(`${method} ${url} - ${error.status || 500} - ${responseTime}ms [${requestId}]`);

        // Audit failed operations
        await this.createAuditLog({
          userId: user?.id,
          action: `${method}_${this.extractResource(url)}_ERROR`,
          resource: url,
          details: { 
            error: error.message, 
            responseTime, 
            success: false,
            statusCode: error.status 
          },
          ipAddress: ip,
          userAgent,
          severity: 'ERROR',
        });

        throw error;
      }),
    );
  }

  private isSensitiveOperation(method: string, url: string): boolean {
    const sensitivePatterns = [
      '/auth/',
      '/payments/',
      '/users/',
      '/vouchers/',
      '/admin/',
    ];
    
    return sensitivePatterns.some(pattern => url.includes(pattern)) ||
           ['POST', 'PUT', 'DELETE'].includes(method);
  }

  private extractResource(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[1] || 'unknown';
  }

  private async createAuditLog(logData: any) {
    try {
      await this.prisma.auditLog.create({
        data: {
          ...logData,
          severity: logData.severity || 'INFO',
        },
      });
    } catch (error) {
      this.logger.error('Failed to create audit log:', error);
    }
  }
}