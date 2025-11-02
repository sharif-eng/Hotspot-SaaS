import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HotspotConfigService {
  constructor(private prisma: PrismaService) {}

  async getConfig() {
    const config = await this.prisma.hotspotConfig.findFirst();
    
    if (!config) {
      return this.createDefaultConfig();
    }
    
    return config;
  }

  async updateConfig(data: any) {
    const existing = await this.prisma.hotspotConfig.findFirst();
    
    if (existing) {
      return this.prisma.hotspotConfig.update({
        where: { id: existing.id },
        data: {
          businessName: data.businessName,
          logoUrl: data.logoUrl,
          merchantCode: data.merchantCode,
          packages: JSON.stringify(data.packages),
          paymentInstructions: JSON.stringify(data.paymentInstructions),
          theme: JSON.stringify(data.theme),
          updatedAt: new Date(),
        },
      });
    } else {
      return this.prisma.hotspotConfig.create({
        data: {
          businessName: data.businessName,
          logoUrl: data.logoUrl,
          merchantCode: data.merchantCode,
          packages: JSON.stringify(data.packages),
          paymentInstructions: JSON.stringify(data.paymentInstructions),
          theme: JSON.stringify(data.theme),
        },
      });
    }
  }

  private async createDefaultConfig() {
    const defaultConfig = {
      businessName: 'WiFi Access Portal',
      logoUrl: '/logo.png',
      merchantCode: '123456',
      packages: [
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
      ],
      paymentInstructions: [
        { step: 1, text: 'Dial *165# on your MTN phone' },
        { step: 2, text: 'Select MoMoPay' },
        { step: 3, text: 'Enter merchant code: 123456' },
        { step: 4, text: 'Enter amount' },
        { step: 5, text: 'Confirm payment with your PIN' },
      ],
      theme: {
        primaryColor: '#3B82F6',
        backgroundColor: 'from-blue-900 via-purple-900 to-indigo-900',
        textColor: '#FFFFFF',
      },
    };

    return this.prisma.hotspotConfig.create({
      data: {
        businessName: defaultConfig.businessName,
        logoUrl: defaultConfig.logoUrl,
        merchantCode: defaultConfig.merchantCode,
        packages: JSON.stringify(defaultConfig.packages),
        paymentInstructions: JSON.stringify(defaultConfig.paymentInstructions),
        theme: JSON.stringify(defaultConfig.theme),
      },
    });
  }
}