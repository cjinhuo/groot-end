import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParseModule } from './parse/parse.module';
@Module({
  imports: [ParseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
