import { Module } from '@nestjs/common';
import { ParseController } from './parse.controlle';
import { ParseService } from './parse.service';
@Module({
  controllers: [ParseController],
  providers: [ParseService],
  exports: [ParseService],
})
export class ParseModule {}
