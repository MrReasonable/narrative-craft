// config/app-config.provider.ts

import { Injectable } from '@nestjs/common'

export interface DatabaseConfig {
  readonly name: string
  readonly clientUrl: string
  readonly user: string
  readonly password: string
}

export interface ServerConfig {
  readonly backendPort: number
  readonly webappPort: number
}

export interface JwtConfig {
  readonly secret: string
  readonly expiresIn: number
}

export interface DebugConfig {
  readonly enabled: boolean
}

export interface AppConfiguration {
  readonly database: DatabaseConfig
  readonly server: ServerConfig
  readonly jwt: JwtConfig
  readonly debug: DebugConfig
}

@Injectable()
export class AppConfigProvider {
  readonly database: Readonly<DatabaseConfig>
  readonly server: Readonly<ServerConfig>
  readonly jwt: Readonly<JwtConfig>
  readonly debug: Readonly<DebugConfig>
  constructor(config: AppConfiguration) {
    this.database = config.database
    this.server = config.server
    this.jwt = config.jwt
    this.debug = config.debug
  }
}
