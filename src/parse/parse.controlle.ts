import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ParseService } from './parse.service';
import { GetSwaggerUrlDto, BuildCodeDto } from './dto/parse.dto';
@Controller('parse')
export class ParseController {
  constructor(private readonly parseService: ParseService) {}

  @Get('list')
  async getTableList(@Query() { url }: GetSwaggerUrlDto ): Promise<any> {
    const res = await this.parseService.createList(url);
    return res;
  }

  @Post('build')
  async BuildCodeWithParam(@Body() { template, formatter, include, url }: BuildCodeDto): Promise<any> {
    let codes = [];
    // 模板内容
    codes = [...this.parseService.createTemplateCodes(template)];
    const res = await this.parseService.createList(url);
    // 单个函数的代码

    console.log(formatter, include);
    return {};
  }
}
