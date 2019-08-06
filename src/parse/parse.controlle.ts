import { Controller, Get } from '@nestjs/common';
import { BackFormatter } from '../Common/BackFormatter';
import { ParseService } from './parse.service';
@Controller('parse')
export class ParseController {
  constructor(private readonly parseService: ParseService) {}

  @Get('list')
  async getTableList(): Promise<object> {
    let data = {};
    const res = await this.parseService.createList('1', '2').toPromise();
    data = res.data;
    return data;
  }

  @Get('test')
  getNumber(): object {
    return {
      one: 1,
    };
  }
}
