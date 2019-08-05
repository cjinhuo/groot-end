import { Controller, Get } from '@nestjs/common';

@Controller('parse')
export class ParseController {
  constructor() {}

  @Get('list')
  getTableList(): string {
    return 'this is test';
  }

}
