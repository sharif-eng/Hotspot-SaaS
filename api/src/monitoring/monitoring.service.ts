import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MonitoringService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      activeUsers,
      totalRevenue,
      todayRevenue,
      activeVouchers,
      expiredVouchers,
      activeSessions,
      totalSessions,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.user.count({ 
        where: { 
          role: 'CUSTOMER',
          sessions: { some: { status: 'ACTIVE' } }
        }
      }),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
        _sum: { amount: true },
      }),
      this.prisma.voucher.count({ where: { status: 'ACTIVE' } }),
      this.prisma.voucher.count({ where: { status: 'EXPIRED' } }),
      this.prisma.hotspotSession.count({ where: { status: 'ACTIVE' } }),
      this.prisma.hotspotSession.count(),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
        today: todayRevenue._sum.amount || 0,
      },
      vouchers: {
        active: activeVouchers,
        expired: expiredVouchers,
      },
      sessions: {
        active: activeSessions,
        total: totalSessions,
      },
    };
  }

  async getRevenueChart(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const payments = await this.prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startDate },
      },
      select: {
        amount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const chartData = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRevenue = payments
        .filter(p => p.createdAt.toISOString().split('T')[0] === dateStr)
        .reduce((sum, p) => sum + Number(p.amount), 0);

      chartData.push({
        date: dateStr,
        revenue: dayRevenue,
      });
    }

    return chartData;
  }

  async getZoneStats() {
    const zones = await this.prisma.hotspotZone.findMany({
      include: {
        _count: {
          select: {
            sessions: { where: { status: 'ACTIVE' } },
            vouchers: { where: { status: 'ACTIVE' } },
          },
        },
      },
    });

    return zones.map(zone => ({
      id: zone.id,
      name: zone.name,
      location: zone.location,
      activeSessions: zone._count.sessions,
      activeVouchers: zone._count.vouchers,
      maxUsers: zone.maxUsers,
      utilization: (zone._count.sessions / zone.maxUsers) * 100,
    }));
  }

  async getSystemHealth() {
    const [
      dbHealth,
      recentErrors,
      systemLoad,
    ] = await Promise.all([
      this.checkDatabaseHealth(),
      this.getRecentErrors(),
      this.getSystemLoad(),
    ]);

    return {
      database: dbHealth,
      errors: recentErrors,
      system: systemLoad,
      timestamp: new Date(),
    };
  }

  private async checkDatabaseHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy', responseTime: Date.now() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  private async getRecentErrors() {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    return this.prisma.auditLog.count({
      where: {
        action: { contains: 'ERROR' },
        createdAt: { gte: oneHourAgo },
      },
    });
  }

  private async getSystemLoad() {
    // In a real implementation, you'd get actual system metrics
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
    };
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredSessions() {
    const expiredSessions = await this.prisma.hotspotSession.updateMany({
      where: {
        status: 'ACTIVE',
        voucher: {
          expiresAt: { lt: new Date() },
        },
      },
      data: {
        status: 'COMPLETED',
        endTime: new Date(),
      },
    });

    if (expiredSessions.count > 0) {
      console.log(`Cleaned up ${expiredSessions.count} expired sessions`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldLogs() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deletedLogs = await this.prisma.auditLog.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo },
      },
    });

    console.log(`Cleaned up ${deletedLogs.count} old audit logs`);
  }
}