import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaModule } from '@/prisma/prisma.module'
import { RegisterUserHandler } from './commands/register-user.handler'
import { UsernameGeneratorService } from './services/username-generator.service'

@Module({
  imports: [CqrsModule, PrismaModule],
  providers: [RegisterUserHandler, UsernameGeneratorService],
  controllers: [UserController],
})
export class UserModule {}
