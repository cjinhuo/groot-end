import { Controller, Get, Query } from '@nestjs/common';
import { ParseService } from './parse.service';
import { GetSwaggerUrlDto } from './dto/parse.dto';
@Controller('parse')
export class ParseController {
  constructor(private readonly parseService: ParseService) {}

  @Get('list')
  async getTableList(@Query() url: GetSwaggerUrlDto ): Promise<any> {
    const data = {};
    const res = await this.parseService.createList(url.url);
    return res;
  }
}
