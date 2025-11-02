import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private prisma: PrismaService) {}

  @Get('stats')
  async getStats() {
    const [
      totalUsers,
      activeVouchers,
      totalRevenue,
      activeSessions,
      totalZones,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.voucher.count({ where: { status: 'ACTIVE' } }),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      this.prisma.hotspotSession.count({ where: { status: 'ACTIVE' } }),
      this.prisma.hotspotZone.count({ where: { isActive: true } }),
    ]);

    return {
      totalUsers,
      activeVouchers,
      totalRevenue: totalRevenue._sum.amount || 0,
      activeSessions,
      totalZones,
      recentPayments: await this.prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { include: { profile: true } } },
      }),
    };
  }
}