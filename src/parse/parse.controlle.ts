import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ParseService } from './parse.service';
import { BuildCodeDto } from './dto/parse.dto';
import { Utils } from '../Common/utils';
import { BackFormatter } from '../Common/BackFormatter';
import { BackFormatterDto } from '../Common/common.dto';

@Controller('parse')
export class ParseController {
  constructor(private readonly parseService: ParseService,
              private readonly utils: Utils,
              private readonly backFormatter: BackFormatter) {}

  @Get('list')
  async getTableList(@Query() { url }: {url: string} ): Promise<BackFormatterDto> {
    const resolveUrl = this.utils.resolveSwaggerUrl(url);
    const res = await this.parseService.createList(resolveUrl);
    return res;
  }

  @Post('build')
  async BuildCodeWithParam(@Body() { template, include, url, getFormatter, postFormatter }: BuildCodeDto): Promise<BackFormatterDto> {
    const resolveUrl = this.utils.resolveSwaggerUrl(url);
    let codes = [];
    // 模板内容
    codes = [...this.parseService.createTemplateCodes(template)];
    const listRes = await this.parseService.createList(resolveUrl);
    if (listRes.success) {
      const originData = listRes.data;
      const selectedData = this.parseService.filterTreeWithIds(originData[0].children, include);
      // 单个函数的代码
      selectedData.forEach(item => {
        const single = this.parseService.createSingleInstance(getFormatter, postFormatter, item);
        codes = codes.concat(single);
        codes.push('\n\n');
      });
      return this.backFormatter.getResult(true, '成功生成代码', codes.join('\n'));
    }
    return listRes;

  }
}
