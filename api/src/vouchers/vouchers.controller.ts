import { Controller, Get, Post, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.vouchersService.findAll();
  }

  @Get('plans')
  async getPlans() {
    return this.vouchersService.getAvailablePlans();
  }

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generate(@Body() body: { planName: string; quantity: number }) {
    return this.vouchersService.generateVouchers(body.planName, body.quantity);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.vouchersService.deleteVoucher(id);
  }

  @Get(':code/validate')
  async validateVoucher(@Param('code') code: string) {
    return this.vouchersService.validateVoucher(code);
  }
}