import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { HotspotConfigService } from './hotspot-config.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('hotspot-config')
export class HotspotConfigController {
  constructor(private readonly hotspotConfigService: HotspotConfigService) {}

  @Get()
  async getConfig() {
    return this.hotspotConfigService.getConfig();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async updateConfig(@Body() config: any) {
    return this.hotspotConfigService.updateConfig(config);
  }
}