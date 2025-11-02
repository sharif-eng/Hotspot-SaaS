import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import { MikrotikModule } from './mikrotik/mikrotik.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { UsersController } from './users/users.controller';
import { ZonesController } from './zones/zones.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { HotspotConfigController } from './hotspot-config/hotspot-config.controller';
import { HotspotConfigService } from './hotspot-config/hotspot-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '24h' },
    }),
    PrismaModule,
    AuthModule,
    PaymentsModule,
    MikrotikModule,
  ],
  controllers: [
    DashboardController,
    AuthController,
    UsersController,
    ZonesController,
    HotspotConfigController,
  ],
  providers: [AuthService, HotspotConfigService],
})
export class AppModule {
  constructor(private mikrotikService: MikrotikService) {
    // Setup default zone on startup
    this.mikrotikService.setupDefaultZone();
  }
}