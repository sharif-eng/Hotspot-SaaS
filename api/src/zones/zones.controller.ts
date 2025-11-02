import { Controller, Get, Post, Body, UseGuards, Param, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { MikrotikService } from '../mikrotik/mikrotik.service';

@Controller('zones')
@UseGuards(JwtAuthGuard)
export class ZonesController {
  constructor(
    private prisma: PrismaService,
    private mikrotikService: MikrotikService,
  ) {}

  @Get()
  async findAll() {
    const zones = await this.prisma.hotspotZone.findMany({
      include: {
        _count: {
          select: {
            sessions: { where: { status: 'ACTIVE' } },
          },
        },
      },
    });

    return zones.map(zone => ({
      ...zone,
      activeUsers: zone._count.sessions,
    }));
  }

  @Post()
  async create(@Body() createZoneDto: {
    name: string;
    location: string;
    mikrotikIp: string;
    apiUser: string;
    apiPassword: string;
    maxUsers: number;
  }) {
    return this.prisma.hotspotZone.create({
      data: createZoneDto,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.hotspotZone.findUnique({
      where: { id },
      include: {
        sessions: {
          where: { status: 'ACTIVE' },
          include: { user: { include: { profile: true } } },
        },
      },
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateZoneDto: any) {
    return this.prisma.hotspotZone.update({
      where: { id },
      data: updateZoneDto,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.hotspotZone.delete({ where: { id } });
  }

  @Get(':id/active-users')
  async getActiveUsers(@Param('id') id: string) {
    return this.mikrotikService.getActiveUsers(id);
  }

  @Post(':id/test-connection')
  async testConnection(@Param('id') id: string) {
    return this.mikrotikService.testConnection(id);
  }
}