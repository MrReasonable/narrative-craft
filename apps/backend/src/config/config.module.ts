import { DynamicModule, Global, Inject, Module } from '@nestjs/common'
import { config as dotenvxConfig } from '@dotenvx/dotenvx'
import { ConfigService } from './config.service'
import path from 'node:path'
import * as Joi from 'joi'

export interface EnvironmentConfig {
  DB_NAME: string
  DB_CLIENT_URL: string
  DB_USER: string
  DB_PASSWORD: string
  BACKEND_PORT: number
  JWT_SECRET: string
  JWT_EXPIRES_IN: number
  DEBUG: boolean
}

const environmentSchema = Joi.object<EnvironmentConfig, true>({
  DB_NAME: Joi.string().required(),
  DB_CLIENT_URL: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  BACKEND_PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.number().default(3600),
  DEBUG: Joi.boolean().default(false),
})

export interface ConfigOptions {
  envFilePath?: string
  useCache?: boolean
  isGlobal?: boolean
  debug?: boolean
}

@Global()
@Module({
  providers: [ConfigService],
})
export class ConfigModule {
  private static config: ConfigService
  static forRoot(@Inject('CONFIG_OPTIONS') options: ConfigOptions = {}): DynamicModule {
    const {
      envFilePath: environmentFilePath = '.env',
      useCache = false,
      isGlobal = false,
      debug = false,
    } = options

    const configProvider = {
      provide: ConfigService,
      useFactory: async (): Promise<ConfigService> => {
        if (useCache && ConfigModule.config) {
          return ConfigModule.config
        }

        const environmentFile = path.resolve(process.cwd(), environmentFilePath)

        const { error, parsed } = dotenvxConfig({
          path: environmentFile,
          override: true,
          debug,
          quiet: true,
        })
        if (error) {
          throw new Error(`Error parsing env file: ${error.message}`)
        }
        const mergedConfig = { ...process.env, ...parsed }
        const validatedConfig = this.validateConfig(mergedConfig)
        const configService = new ConfigService(validatedConfig)

        if (useCache) {
          ConfigModule.config = configService
        }

        return configService
      },
    }

    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        configProvider,
      ],
      exports: [ConfigService],
      global: isGlobal,
    }
  }

  private static validateConfig(config: Record<string, unknown>): EnvironmentConfig {
    const { error, value } = environmentSchema.validate(config, {
      allowUnknown: true,
      stripUnknown: true,
    })
    if (error) {
      throw new Error(`Config validation error: ${error.message}`)
    }
    return value
  }
}
