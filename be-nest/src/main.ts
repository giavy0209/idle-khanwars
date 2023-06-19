import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import 'config'
import { AppModule } from './modules/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder()
    .setBasePath(global.Config.CONTEXT)
    .setTitle('NestJS Skeleton example')
    .setDescription('The NestJS Skeleton API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http' }, 'JWT-auth')
    .addSecurityRequirements('JWT-auth')
    .build()
  const appDocument = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(`${global.Config.CONTEXT}/api-docs`, app, appDocument)

  await app.listen(global.Config.PORT)
}
bootstrap()
