import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigModuleOptions, ConfigService } from '@nestjs/config'
import {
  databaseConfig,
  serverConfig,
  jwtConfig,
  debugConfig,
  validationSchema,
  EnvConfig,
} from './configuration'
import { AppConfigProvider, AppConfiguration } from './app-config.provider'

export interface AppConfigModuleOptions extends ConfigModuleOptions {
  useCache?: boolean
  isGlobal?: boolean
}

@Module({})
export class AppConfigModule {
  static forRoot(options: AppConfigModuleOptions = {}): DynamicModule {
    const { useCache = false, isGlobal = false, ...configModuleOptions } = options

    return {
      module: AppConfigModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: isGlobal,
          validationSchema,
          validationOptions: {
            abortEarly: true,
          },
          cache: useCache,
          ...configModuleOptions,
        }),
      ],
      providers: [
        {
          provide: AppConfigProvider,
          useFactory: (configService: ConfigService): AppConfigProvider => {
            const envConfig = configService.get<EnvConfig>('')
            if (!envConfig) {
              throw new Error('Environment configuration not found')
            }
            const config: AppConfiguration = {
              database: databaseConfig(),
              server: serverConfig(),
              jwt: jwtConfig(),
              debug: debugConfig(),
            }
            return new AppConfigProvider(config)
          },
          inject: [ConfigService],
        },
      ],
      exports: [AppConfigProvider],
      global: isGlobal,
    }
  }
}
