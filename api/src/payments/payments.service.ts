import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MtnService } from './providers/mtn.service';
import { MikrotikService } from '../mikrotik/mikrotik.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private mtnService: MtnService,
    private mikrotikService: MikrotikService,
  ) {}

  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        user: true,
        voucher: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async verifyPaymentAndGenerateVoucher(data: {
    phoneNumber: string;
    transactionId: string;
    packageId: string;
    mikrotikParams?: any;
  }) {
    try {
      // Verify payment with MTN
      const paymentStatus = await this.mtnService.checkPaymentStatus(data.transactionId);
      
      if (paymentStatus.status !== 'SUCCESSFUL') {
        throw new Error('Payment not found or not successful');
      }

      // Get voucher plan
      const plan = await this.getVoucherPlan(data.packageId);
      if (!plan) {
        throw new Error('Invalid package selected');
      }

      // Generate voucher code
      const voucherCode = this.generateVoucherCode();

      // Create voucher in database
      const voucher = await this.prisma.voucher.create({
        data: {
          code: voucherCode,
          planName: plan.name,
          duration: plan.duration,
          price: plan.price,
          currency: plan.currency,
          status: 'ACTIVE',
          expiresAt: new Date(Date.now() + plan.duration * 60 * 1000),
        },
      });

      // Create payment record
      await this.prisma.payment.create({
        data: {
          amount: plan.price,
          currency: plan.currency,
          method: 'MTN_MOMO',
          status: 'COMPLETED',
          transactionId: data.transactionId,
          phoneNumber: data.phoneNumber,
          voucherId: voucher.id,
        },
      });

      // Add user to MikroTik
      await this.mikrotikService.addHotspotUser({
        username: voucherCode,
        password: voucherCode,
        profile: this.getMikrotikProfile(plan.duration),
        timeLimit: `${Math.floor(plan.duration / 60)}:${plan.duration % 60}:00`,
      });

      return {
        success: true,
        voucherCode,
        message: 'Payment verified and voucher generated successfully',
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        message: error.message || 'Payment verification failed',
      };
    }
  }

  async handleMtnCallback(data: any) {
    // Handle MTN payment callbacks
    console.log('MTN Callback received:', data);
    return { status: 'received' };
  }

  async getPaymentStatus(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { voucher: true },
    });
  }

  private generateVoucherCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  private async getVoucherPlan(packageId: string) {
    const plans = {
      'basic-30': { name: 'Quick Browse', duration: 30, price: 500, currency: 'UGX' },
      'standard-60': { name: 'Standard Access', duration: 60, price: 1000, currency: 'UGX' },
      'premium-180': { name: 'Extended Session', duration: 180, price: 2500, currency: 'UGX' },
    };
    return plans[packageId] || null;
  }

  private getMikrotikProfile(duration: number): string {
    if (duration <= 30) return '30min';
    if (duration <= 60) return '1hour';
    if (duration <= 180) return '3hour';
    return 'default';
  }
}