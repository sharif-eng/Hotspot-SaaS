import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MikrotikService } from './mikrotik.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('mikrotik')
@UseGuards(JwtAuthGuard)
export class MikrotikController {
  constructor(private readonly mikrotikService: MikrotikService) {}

  @Post('zones/:zoneId/users')
  async addUser(
    @Param('zoneId') zoneId: string,
    @Body() body: { username: string; password: string; profile: string; comment?: string }
  ) {
    return this.mikrotikService.addHotspotUser(
      zoneId,
      body.username,
      body.password,
      body.profile,
      body.comment
    );
  }

  @Delete('zones/:zoneId/users/:username')
  async removeUser(
    @Param('zoneId') zoneId: string,
    @Param('username') username: string
  ) {
    return this.mikrotikService.removeHotspotUser(zoneId, username);
  }

  @Get('zones/:zoneId/users/active')
  async getActiveUsers(@Param('zoneId') zoneId: string) {
    return this.mikrotikService.getActiveUsers(zoneId);
  }

  @Post('zones/:zoneId/users/:username/disconnect')
  async disconnectUser(
    @Param('zoneId') zoneId: string,
    @Param('username') username: string
  ) {
    return this.mikrotikService.disconnectUser(zoneId, username);
  }

  @Get('zones/:zoneId/test')
  async testConnection(@Param('zoneId') zoneId: string) {
    return this.mikrotikService.testConnection(zoneId);
  }

  @Get('zones/:zoneId/info')
  async getSystemInfo(@Param('zoneId') zoneId: string) {
    return this.mikrotikService.getSystemInfo(zoneId);
  }
}