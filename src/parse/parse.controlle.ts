import { Controller, Get } from '@nestjs/common';
import { BackFormatter } from '../Utils/BackFormatter';
import { ParseService } from './parse.service';
@Controller('parse')
export class ParseController {
  constructor(private readonly backFormatter: BackFormatter) {}

  @Get('list')
  getTableList(): object {
    // const backFormatter = new BackFormatter();
    // return backFormatter.getResult(true, '成功返回', [{
    //   test: 1,
    // }]);
    return this.backFormatter.getResult(true, '成功返回', [{
      test: 1,
    }]);
  }
}
