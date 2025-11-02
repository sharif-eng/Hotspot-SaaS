import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  async getHealth() {
    return this.healthService.getSystemHealth();
  }

  @Get('detailed')
  async getDetailedHealth() {
    return this.healthService.getDetailedHealth();
  }

  @Get('metrics')
  async getMetrics() {
    return this.healthService.getSystemMetrics();
  }
}