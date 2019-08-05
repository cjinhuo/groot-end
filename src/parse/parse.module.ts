import { Module } from '@nestjs/common';
import { ParseController } from './parse.controlle';
import { ParseService } from './parse.service';
import { BackFormatter } from '../Utils/BackFormatter';
@Module({
  controllers: [ParseController],
  providers: [ParseService, BackFormatter],
  exports: [ParseService],
})
export class ParseModule {}
