import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import 'config'
import { AppModule } from './modules/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.connectMicroservice<MicroserviceOptions>({
    transport : Transport.TCP,
    options : {
      port :Number( global.Config.PORT)
    }
  })

  await app.startAllMicroservices()

  app.setGlobalPrefix(global.Config.CONTEXT)
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder()
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
