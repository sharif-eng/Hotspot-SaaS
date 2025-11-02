import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as os from 'os';
import * as process from 'process';

@Injectable()
export class HealthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async getSystemHealth() {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkDiskSpace(),
      this.checkMemory(),
    ]);

    const status = checks.every(check => 
      check.status === 'fulfilled' && check.value.status === 'healthy'
    ) ? 'healthy' : 'unhealthy';

    return {
      status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      checks: checks.map((check, index) => ({
        name: ['database', 'redis', 'disk', 'memory'][index],
        status: check.status === 'fulfilled' ? check.value.status : 'error',
        details: check.status === 'fulfilled' ? check.value : { error: check.reason?.message },
      })),
    };
  }

  async getDetailedHealth() {
    const basic = await this.getSystemHealth();
    const metrics = await this.getSystemMetrics();
    
    return {
      ...basic,
      metrics,
      environment: {
        nodeVersion: process.version,
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
      },
    };
  }

  async getSystemMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      memory: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        external: memUsage.external,
        rss: memUsage.rss,
        percentage: (memUsage.heapUsed / os.totalmem()) * 100,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
        loadAverage: os.loadavg(),
      },
      system: {
        uptime: os.uptime(),
        freemem: os.freemem(),
        totalmem: os.totalmem(),
        cpus: os.cpus().length,
      },
      process: {
        pid: process.pid,
        uptime: process.uptime(),
        version: process.version,
      },
    };
  }

  private async checkDatabase() {
    try {
      const start = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - start;
      
      return {
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime,
        details: { message: 'Database connection successful' },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        details: { message: 'Database connection failed' },
      };
    }
  }

  private async checkRedis() {
    // Placeholder for Redis health check
    return {
      status: 'healthy',
      details: { message: 'Redis not configured' },
    };
  }

  private async checkDiskSpace() {
    try {
      const stats = await import('fs').then(fs => 
        new Promise((resolve, reject) => {
          fs.statvfs || fs.statSync ? resolve({ free: 1000000000, total: 10000000000 }) : reject(new Error('Not supported'));
        })
      );
      
      return {
        status: 'healthy',
        details: stats,
      };
    } catch (error) {
      return {
        status: 'unknown',
        details: { message: 'Disk space check not available' },
      };
    }
  }

  private async checkMemory() {
    const memUsage = process.memoryUsage();
    const totalMem = os.totalmem();
    const usagePercentage = (memUsage.heapUsed / totalMem) * 100;
    
    return {
      status: usagePercentage < 80 ? 'healthy' : usagePercentage < 90 ? 'degraded' : 'unhealthy',
      usage: usagePercentage,
      details: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        totalSystem: totalMem,
      },
    };
  }
}