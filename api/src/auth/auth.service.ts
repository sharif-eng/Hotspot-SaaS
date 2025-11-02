import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (user && await this.validatePassword(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    // Check for demo admin credentials
    if (email === 'sharifidris8@gmail.com' && password === 'Sharif.255') {
      const user = await this.createOrUpdateDemoAdmin();
      const payload = { email: user.email, sub: user.id, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      };
    }

    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    };
  }

  private async createOrUpdateDemoAdmin() {
    const hashedPassword = await bcrypt.hash('Sharif.255', 10);
    
    return this.prisma.user.upsert({
      where: { email: 'sharifidris8@gmail.com' },
      update: {
        passwordHash: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
      create: {
        email: 'sharifidris8@gmail.com',
        passwordHash: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
        profile: {
          create: {
            fullName: 'Sharif Idris',
            tier: 'VIP',
          },
        },
      },
      include: { profile: true },
    });
  }

  private async validatePassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      return false;
    }
  }

  async register(email: string, password: string, fullName?: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: 'CUSTOMER',
        profile: {
          create: {
            fullName: fullName || email.split('@')[0],
            tier: 'BASIC',
          },
        },
      },
      include: { profile: true },
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    };
  }
}