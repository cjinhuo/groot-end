import { Module, HttpModule } from '@nestjs/common';
import { ParseController } from './parse.controlle';
import { ParseService } from './parse.service';
import { BackFormatter } from '../Common/BackFormatter';
@Module({
  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
    responseType: 'json',
    withCredentials: true,
  })],
  controllers: [ParseController],
  providers: [ParseService, BackFormatter],
  exports: [ParseService],
})
export class ParseModule {}
