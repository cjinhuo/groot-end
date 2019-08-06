import { Controller, Get } from '@nestjs/common';
import { BackFormatter } from '../Common/BackFormatter';
import { GetSwaggerService } from './getSwagger.service';

@Controller('getSwagger')
export class GetSwaggerController {
  constructor(private readonly getSwaggerService: GetSwaggerService) {}
  @Get('url')
  async getTableList(): Promise<object> {
    let data = {};
    const res = await this.getSwaggerService.createList('1', '2').toPromise();
    data = res.data;
    return data;
  }
}
