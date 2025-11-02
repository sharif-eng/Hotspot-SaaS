import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RouterOSAPI } from 'routeros-client';

interface ActiveUser {
  user: string;
  address: string;
  macAddress: string;
  uptime: string;
  bytesIn: number;
  bytesOut: number;
}

@Injectable()
export class MikrotikService {
  private readonly logger = new Logger(MikrotikService.name);
  private readonly simulatorMode: boolean;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.simulatorMode = this.configService.get('NODE_ENV') === 'development';
  }

  private async getConnection(zoneId: string): Promise<RouterOSAPI | null> {
    const zone = await this.prisma.hotspotZone.findUnique({
      where: { id: zoneId },
    });

    if (!zone) {
      throw new Error('Hotspot zone not found');
    }

    if (this.simulatorMode) {
      this.logger.log(`[SIMULATOR] Connecting to ${zone.mikrotikIp}`);
      return null;
    }

    try {
      const conn = new RouterOSAPI({
        host: zone.mikrotikIp,
        user: zone.apiUser,
        password: zone.apiPassword,
        port: this.configService.get('DEFAULT_MIKROTIK_PORT', 8728),
        timeout: this.configService.get('DEFAULT_MIKROTIK_TIMEOUT', 5000),
      });

      await conn.connect();
      return conn;
    } catch (error) {
      this.logger.error(`Failed to connect to MikroTik: ${error.message}`);
      throw error;
    }
  }

  async addHotspotUser(userData: {
    username: string;
    password: string;
    profile?: string;
    timeLimit?: string;
    zoneId?: string;
  }) {
    const zoneId = userData.zoneId || 'default';
    const username = userData.username;
    const password = userData.password;
    const profile = userData.profile || 'default';
    const comment = `Voucher: ${username} - ${new Date().toISOString()}`;
    
    return this.addHotspotUserToZone(zoneId, username, password, profile, comment);
  }

  async addHotspotUserToZone(zoneId: string, username: string, password: string, profile: string, comment?: string) {
    try {
      const zone = await this.prisma.hotspotZone.findUnique({ where: { id: zoneId } });
      if (!zone) throw new Error('Hotspot zone not found');

      if (this.simulatorMode) {
        this.logger.log(`[SIMULATOR] Adding user ${username} to zone ${zone.name}`);
        return {
          success: true,
          username,
          profile,
          message: 'User added successfully (simulated)',
          data: { '.id': `*${Math.random().toString(36).substr(2, 8)}` }
        };
      }

      const conn = await this.getConnection(zoneId);
      const result = await conn.write(['/ip/hotspot/user/add', 
        `=name=${username}`,
        `=password=${password}`,
        `=profile=${profile}`,
        `=comment=${comment || `Added by WiFi Billing System - ${new Date().toISOString()}`}`
      ]);

      await conn.close();
      
      return {
        success: true,
        username,
        profile,
        message: 'User added successfully',
        data: result
      };
    } catch (error) {
      this.logger.error(`Failed to add hotspot user: ${error.message}`);
      throw error;
    }
  }

  async removeHotspotUser(zoneId: string, username: string) {
    try {
      const zone = await this.prisma.hotspotZone.findUnique({ where: { id: zoneId } });
      if (!zone) throw new Error('Hotspot zone not found');

      if (this.simulatorMode) {
        this.logger.log(`[SIMULATOR] Removing user ${username} from zone ${zone.name}`);
        return {
          success: true,
          username,
          message: 'User removed successfully (simulated)'
        };
      }

      const conn = await this.getConnection(zoneId);
      
      const users = await conn.write(['/ip/hotspot/user/print', `?name=${username}`]);
      if (!users || users.length === 0) {
        throw new Error('User not found');
      }

      await conn.write(['/ip/hotspot/user/remove', `=.id=${users[0]['.id']}`]);
      await conn.close();
      
      return {
        success: true,
        username,
        message: 'User removed successfully'
      };
    } catch (error) {
      this.logger.error(`Failed to remove hotspot user: ${error.message}`);
      throw error;
    }
  }

  async getActiveUsers(zoneId: string): Promise<{ success: boolean; users: ActiveUser[]; count: number }> {
    try {
      const zone = await this.prisma.hotspotZone.findUnique({ where: { id: zoneId } });
      if (!zone) throw new Error('Hotspot zone not found');

      if (this.simulatorMode) {
        const mockUsers: ActiveUser[] = [
          {
            user: 'demo_user_001',
            address: '192.168.1.100',
            macAddress: '00:11:22:33:44:55',
            uptime: '00:15:30',
            bytesIn: 1024000,
            bytesOut: 512000
          },
          {
            user: 'demo_user_002', 
            address: '192.168.1.101',
            macAddress: '00:11:22:33:44:56',
            uptime: '01:22:15',
            bytesIn: 5120000,
            bytesOut: 2048000
          }
        ];
        
        this.logger.log(`[SIMULATOR] Getting active users for zone ${zone.name}`);
        return {
          success: true,
          users: mockUsers,
          count: mockUsers.length
        };
      }

      const conn = await this.getConnection(zoneId);
      const activeUsers = await conn.write('/ip/hotspot/active/print');
      await conn.close();

      const users: ActiveUser[] = activeUsers.map((user: any) => ({
        user: user.user || 'Unknown',
        address: user.address || '0.0.0.0',
        macAddress: user['mac-address'] || '00:00:00:00:00:00',
        uptime: user.uptime || '00:00:00',
        bytesIn: parseInt(user['bytes-in']) || 0,
        bytesOut: parseInt(user['bytes-out']) || 0
      }));
      
      return {
        success: true,
        users,
        count: users.length
      };
    } catch (error) {
      this.logger.error(`Failed to get active users: ${error.message}`);
      throw error;
    }
  }

  async disconnectUser(zoneId: string, username: string) {
    try {
      const zone = await this.prisma.hotspotZone.findUnique({ where: { id: zoneId } });
      if (!zone) throw new Error('Hotspot zone not found');

      if (this.simulatorMode) {
        this.logger.log(`[SIMULATOR] Disconnecting user ${username} from zone ${zone.name}`);
        return {
          success: true,
          username,
          message: 'User disconnected successfully (simulated)'
        };
      }

      const conn = await this.getConnection(zoneId);
      
      const sessions = await conn.write(['/ip/hotspot/active/print', `?user=${username}`]);
      if (!sessions || sessions.length === 0) {
        throw new Error('Active session not found');
      }

      await conn.write(['/ip/hotspot/active/remove', `=.id=${sessions[0]['.id']}`]);
      await conn.close();
      
      return {
        success: true,
        username,
        message: 'User disconnected successfully'
      };
    } catch (error) {
      this.logger.error(`Failed to disconnect user: ${error.message}`);
      throw error;
    }
  }

  async testConnection(zoneId: string) {
    try {
      const zone = await this.prisma.hotspotZone.findUnique({ where: { id: zoneId } });
      if (!zone) throw new Error('Hotspot zone not found');

      if (this.simulatorMode) {
        this.logger.log(`[SIMULATOR] Testing connection to ${zone.mikrotikIp}`);
        return {
          success: true,
          message: 'Connection successful (simulated)',
          version: 'RouterOS 7.11.2 (simulated)',
          identity: `${zone.name}-Router`,
          uptime: '2w3d15h30m45s'
        };
      }

      const conn = await this.getConnection(zoneId);
      const identity = await conn.write('/system/identity/print');
      const resource = await conn.write('/system/resource/print');
      await conn.close();
      
      return {
        success: true,
        message: 'Connection successful',
        version: resource[0]?.version || 'Unknown',
        identity: identity[0]?.name || 'Unknown',
        uptime: resource[0]?.uptime || 'Unknown'
      };
    } catch (error) {
      this.logger.error(`Connection test failed: ${error.message}`);
      throw error;
    }
  }

  async getSystemInfo(zoneId: string) {
    try {
      const zone = await this.prisma.hotspotZone.findUnique({ where: { id: zoneId } });
      if (!zone) throw new Error('Hotspot zone not found');

      if (this.simulatorMode) {
        return {
          success: true,
          info: {
            identity: `${zone.name}-Router`,
            version: 'RouterOS 7.11.2 (simulated)',
            uptime: '2w3d15h30m45s',
            cpuLoad: '15%',
            freeMemory: '85%',
            activeUsers: 12
          }
        };
      }

      const conn = await this.getConnection(zoneId);
      const [identity, resource, activeUsers] = await Promise.all([
        conn.write('/system/identity/print'),
        conn.write('/system/resource/print'),
        conn.write('/ip/hotspot/active/print')
      ]);
      await conn.close();
      
      return {
        success: true,
        info: {
          identity: identity[0]?.name || 'Unknown',
          version: resource[0]?.version || 'Unknown',
          uptime: resource[0]?.uptime || 'Unknown',
          cpuLoad: resource[0]?.['cpu-load'] || '0%',
          freeMemory: resource[0]?.['free-memory'] || '0',
          activeUsers: activeUsers?.length || 0
        }
      };
    } catch (error) {
      this.logger.error(`Failed to get system info: ${error.message}`);
      throw error;
    }
  }

  async setupDefaultZone() {
    try {
      const existingZone = await this.prisma.hotspotZone.findFirst({
        where: { name: 'Default Zone' }
      });

      if (!existingZone) {
        await this.prisma.hotspotZone.create({
          data: {
            id: 'default',
            name: 'Default Zone',
            mikrotikIp: '192.168.1.1',
            apiUser: 'admin',
            apiPassword: 'admin',
            location: 'Main Location',
            status: 'ACTIVE'
          }
        });
      }
    } catch (error) {
      this.logger.error('Failed to setup default zone:', error);
    }
  }
}