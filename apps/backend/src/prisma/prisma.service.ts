import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { ConfigService } from 'src/config/config.service'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.databaseConfig.clientUrl,
        },
      },
    })
  }

  async onModuleInit() {
    await this.$connect()
  }
}
