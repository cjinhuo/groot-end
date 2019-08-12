import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import history = require('connect-history-api-fallback');

// declare const module: any;

async function bootstrap() {
  // let nativeApp = express();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(history());
  // app.useStaticAssets(join(__dirname, '', '../static'));
  app.useStaticAssets(join(__dirname, '', '../static'));
  // 启用CORS
  app.enableCors();
  await app.listen(8080);
  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
}

bootstrap();
