/** @format */

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import '@vypham0209/nestjs-common';
import 'config';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(global.Config.APP_CONTEXT);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Idle khanwars')
    .setDescription('Idle khanwars API ')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http' }, 'JWT-auth')
    .addSecurityRequirements('JWT-auth')
    .build();

  const appDocument = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    `${global.Config.APP_CONTEXT}/api-docs`,
    app,
    appDocument,
  );
  await app.listen(global.Config.PORT);
  return app;
}
const server = bootstrap();
export default server;
