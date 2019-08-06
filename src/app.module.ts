import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParseModule } from './parse/parse.module';
import { GetSwaggerModule } from './getSwagger/getSwagger.module';
@Module({
  imports: [ParseModule, GetSwaggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
