import { Module } from '@nestjs/common'
import { ConfigModule } from './config/config.module'
import { UserModule } from './user/user.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE_PATH ?? '.env',
      useCache: true,
      isGlobal: true,
    }),
    UserModule,
    PrismaModule,
  ],
})
export class AppModule {}
