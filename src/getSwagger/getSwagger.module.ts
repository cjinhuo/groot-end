import { Module, HttpModule } from '@nestjs/common';
import { GetSwaggerController } from './getSwagger.controller';
import { GetSwaggerService } from './getSwagger.service';
import { BackFormatter } from 'src/Common/BackFormatter';
@Module({
  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
    responseType: 'json',
    withCredentials: true,
  })],
  providers: [GetSwaggerService, BackFormatter],
  controllers: [GetSwaggerController],
  exports: [],
})
export class GetSwaggerModule { }
