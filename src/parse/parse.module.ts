import { Module, HttpModule } from '@nestjs/common';
import { ParseController } from './parse.controlle';
import { ParseService } from './parse.service';
import { BackFormatter } from '../Common/BackFormatter';
import { GetSwaggerService } from '../getSwagger/getSwagger.service';
@Module({
  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
    responseType: 'json',
    withCredentials: true,
  })],
  controllers: [ParseController],
  providers: [ParseService, GetSwaggerService, BackFormatter],
  exports: [ParseService],
})
export class ParseModule {}
