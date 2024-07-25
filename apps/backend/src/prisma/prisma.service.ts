import { Injectable, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { ConfigService } from 'src/config/config.service'
import { UserModelExtension } from './models/user.model'

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'info' | 'warn' | 'error'>
  implements OnModuleInit
{
  constructor(
    readonly config: ConfigService,
    readonly userExtension: UserModelExtension,
  ) {
    super({
      datasources: {
        db: {
          url: config.databaseConfig.clientUrl,
        },
      },
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    })
    this.$extends(userExtension.extend)
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
