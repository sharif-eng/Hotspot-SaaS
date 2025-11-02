import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.paymentsService.findAll();
  }

  @Post('verify-and-generate')
  async verifyAndGenerate(@Body() body: {
    phoneNumber: string;
    transactionId: string;
    packageId: string;
    mikrotikParams?: any;
  }) {
    return this.paymentsService.verifyPaymentAndGenerateVoucher(body);
  }

  @Post('mtn/callback')
  async mtnCallback(@Body() body: any) {
    return this.paymentsService.handleMtnCallback(body);
  }

  @Get(':id/status')
  async getPaymentStatus(@Param('id') id: string) {
    return this.paymentsService.getPaymentStatus(id);
  }
}