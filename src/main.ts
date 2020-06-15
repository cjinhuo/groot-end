import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import history = require('connect-history-api-fallback');
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// tslint:disable-next-line: no-var-requires
const express = require('express');

// declare const module: any;

async function bootstrap() {
  const nativeApp = express();
  nativeApp.use(history());
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Groot-End')
    .setDescription('Groot-End API Description')
    .setVersion('1.0')
    .addTag('groot')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  // app.use(history());
  app.useStaticAssets(join(__dirname, '', '../static'));
  // app.useStaticAssets(join(__dirname, '', '../static'));
  // 启用CORS
  app.enableCors();
  await app.listen(8090);
  console.log('\x1B[35m' + '\x1B[49m', 'http://localhost:8090');
  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
}

bootstrap();
