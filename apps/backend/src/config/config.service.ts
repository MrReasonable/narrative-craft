import { Injectable } from '@nestjs/common'
import { EnvConfig as EnvironmentConfig } from './config.module'

@Injectable()
export class ConfigService {
  constructor(private readonly environmentConfig: EnvironmentConfig) {
    this.envConfig = environmentConfig
  }

  // Helper functions to get typed config sections
  public get databaseConfig() {
    return {
      name: this.envConfig.DB_NAME,
      clientUrl: this.envConfig.DB_CLIENT_URL,
      user: this.envConfig.DB_USER,
      password: this.envConfig.DB_PASSWORD,
    }
  }

  public get serverConfig() {
    return {
      port: this.envConfig.BACKEND_PORT,
    }
  }

  public get jwtConfig() {
    return {
      secret: this.envConfig.JWT_SECRET,
      expiresIn: this.envConfig.JWT_EXPIRES_IN,
    }
  }

  public get debugConfig() {
    return {
      enabled: this.envConfig.DEBUG,
    }
  }
}
