import { Controller, Get, Post, Body, UseGuards, Param, Delete, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.user.findMany({
      include: { profile: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  async create(@Body() createUserDto: { email: string; password: string; fullName: string; role?: string }) {
    const passwordHash = await bcrypt.hash(createUserDto.password, 12);
    
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash,
        role: createUserDto.role || 'CUSTOMER',
        profile: {
          create: {
            fullName: createUserDto.fullName,
          },
        },
      },
      include: { profile: true },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true, vouchers: true, payments: true },
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: updateUserDto.isActive,
        profile: {
          update: {
            fullName: updateUserDto.fullName,
          },
        },
      },
      include: { profile: true },
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}