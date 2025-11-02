import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MtnService } from './providers/mtn.service';
import { AirtelService } from './providers/airtel.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PaymentsService, MtnService, AirtelService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}