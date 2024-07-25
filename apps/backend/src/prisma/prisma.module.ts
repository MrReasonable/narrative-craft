import { ConfigModule } from '@/config/config.module'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { UserModelExtension } from './models/user.model'

@Module({
  imports: [ConfigModule],
  providers: [PrismaService, UserModelExtension],
  exports: [PrismaService],
})
export class PrismaModule {}
