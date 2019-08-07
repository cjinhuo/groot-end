import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ParseService } from './parse.service';
import { GetSwaggerUrlDto, BuildCodeDto } from './dto/parse.dto';
import { Utils } from '../Common/utils';

@Controller('parse')
export class ParseController {
  constructor(private readonly parseService: ParseService, private readonly utils: Utils) {}

  @Get('list')
  async getTableList(@Query() { url }: GetSwaggerUrlDto ): Promise<any> {
    const resolveUrl = this.utils.resolveSwaggerUrl(url);
    const res = await this.parseService.createList(resolveUrl);
    return res;
  }

  @Post('build')
  async BuildCodeWithParam(@Body() { template, formatter, include, url }: BuildCodeDto): Promise<any> {
    const resolveUrl = this.utils.resolveSwaggerUrl(url);
    let codes = [];
    // 模板内容
    codes = [...this.parseService.createTemplateCodes(template)];
    const originData = await this.parseService.createList(resolveUrl);
    const selectedData =  this.parseService.filterTreeWithIds(originData[0].children, include);
    // 单个函数的代码
    return selectedData;
  }
}
