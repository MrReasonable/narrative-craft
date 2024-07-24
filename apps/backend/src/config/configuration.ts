import { registerAs } from '@nestjs/config'
import Joi from 'joi'

export interface EnvConfig {
  DB_NAME: string
  DB_CLIENT_URL: string
  DB_USER: string
  DB_PASSWORD: string
  BACKEND_PORT: number
  WEBAPP_PORT: number
  JWT_SECRET: string
  JWT_EXPIRES_IN: number
  DEBUG: boolean
}

export const validationSchema = Joi.object<EnvConfig, true>({
  DB_NAME: Joi.string().required(),
  DB_CLIENT_URL: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  BACKEND_PORT: Joi.number().default(3000),
  WEBAPP_PORT: Joi.number().default(3001),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.number().default(3600),
  DEBUG: Joi.boolean().default(false),
})

let memoizedValidation: EnvConfig | null = null
// A function to validate and transform the config
function validateConfig(config: Record<string, unknown>): EnvConfig {
  if (memoizedValidation !== null) {
    return memoizedValidation
  }

  const { error, value } = validationSchema.validate(config, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) {
    throw new Error(`Config validation error: ${error.message}`)
  }
  memoizedValidation = value
  return value
}

// Memoized createConfig function
let memoizedConfig: EnvConfig | null = null
export const createConfig = (): EnvConfig => {
  if (memoizedConfig === null) {
    memoizedConfig = validateConfig(process.env)
  }
  return memoizedConfig
}

// Use registerAs with memoized config
export const databaseConfig = registerAs('database', () => {
  const config = createConfig()
  return {
    name: config.DB_NAME,
    clientUrl: config.DB_CLIENT_URL,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
  }
})

export const serverConfig = registerAs('server', () => {
  const config = createConfig()
  return {
    backendPort: config.BACKEND_PORT,
    webappPort: config.WEBAPP_PORT,
  }
})

export const jwtConfig = registerAs('jwt', () => {
  const config = createConfig()
  return {
    secret: config.JWT_SECRET,
    expiresIn: config.JWT_EXPIRES_IN,
  }
})

export const debugConfig = registerAs('debug', () => {
  const config = createConfig()
  return {
    enabled: config.DEBUG,
  }
})
