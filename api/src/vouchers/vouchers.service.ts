import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MikrotikService } from '../mikrotik/mikrotik.service';

@Injectable()
export class VouchersService {
  constructor(
    private prisma: PrismaService,
    private mikrotikService: MikrotikService,
  ) {}

  async findAll() {
    return this.prisma.voucher.findMany({
      include: {
        payment: true,
        sessions: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAvailablePlans() {
    return [
      {
        id: 'basic-30',
        name: 'Quick Browse',
        duration: 30,
        price: 500,
        currency: 'UGX',
        description: '30 minutes of high-speed internet',
      },
      {
        id: 'standard-60',
        name: 'Standard Access',
        duration: 60,
        price: 1000,
        currency: 'UGX',
        description: '1 hour of unlimited browsing',
        popular: true,
      },
      {
        id: 'premium-180',
        name: 'Extended Session',
        duration: 180,
        price: 2500,
        currency: 'UGX',
        description: '3 hours of premium internet access',
      },
      {
        id: 'daily-1440',
        name: 'Full Day Access',
        duration: 1440,
        price: 5000,
        currency: 'UGX',
        description: '24 hours of unlimited internet',
      },
    ];
  }

  async generateVouchers(planName: string, quantity: number) {
    const vouchers = [];
    
    for (let i = 0; i < quantity; i++) {
      const code = this.generateVoucherCode();
      const plan = this.getPlanByName(planName);
      
      const voucher = await this.prisma.voucher.create({
        data: {
          code,
          planName: plan.name,
          duration: plan.duration,
          price: plan.price,
          currency: plan.currency,
          status: 'UNUSED',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days validity
        },
      });

      vouchers.push(voucher);
    }

    return vouchers;
  }

  async deleteVoucher(id: string) {
    return this.prisma.voucher.delete({
      where: { id },
    });
  }

  async validateVoucher(code: string) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { code },
    });

    if (!voucher) {
      return { valid: false, message: 'Voucher not found' };
    }

    if (voucher.status === 'USED') {
      return { valid: false, message: 'Voucher already used' };
    }

    if (voucher.expiresAt < new Date()) {
      return { valid: false, message: 'Voucher expired' };
    }

    return { valid: true, voucher };
  }

  private generateVoucherCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  private getPlanByName(planName: string) {
    const plans = {
      'Quick Browse': { name: 'Quick Browse', duration: 30, price: 500, currency: 'UGX' },
      'Standard Access': { name: 'Standard Access', duration: 60, price: 1000, currency: 'UGX' },
      'Extended Session': { name: 'Extended Session', duration: 180, price: 2500, currency: 'UGX' },
      'Full Day Access': { name: 'Full Day Access', duration: 1440, price: 5000, currency: 'UGX' },
    };
    return plans[planName] || plans['Standard Access'];
  }
}