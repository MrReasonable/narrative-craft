import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@config/config.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
    .setTitle('Narrative Craft API')
    .setDescription('The Narrative Craft API documentation')
    .setVersion('1.0')
    .addTag('narrative-craft')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  const appConfig = app.get(ConfigService)
  const port = appConfig.serverConfig.port
  await app.listen(port)
}
bootstrap()
