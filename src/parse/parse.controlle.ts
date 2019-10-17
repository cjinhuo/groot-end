import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ParseService } from './parse.service';
import { BuildCodeDto } from './dto/parse.dto';
import { Utils } from '../Common/utils';
import { BackFormatter } from '../Common/BackFormatter';
import { BackFormatterDto } from '../Common/common.dto';
import { listeners } from 'cluster';

@Controller('parse')
export class ParseController {
  constructor(private readonly parseService: ParseService,
              private readonly utils: Utils,
              private readonly backFormatter: BackFormatter) {}

  @Get('list')
  async getTableList(@Query() { url }: {url: string} ): Promise<BackFormatterDto> {
    const res = await this.parseService.createList(url);
    return res;
  }

  @Get('listUrls')
  async getListUrls(@Query() { url }: { url: string }): Promise<any> {
    const listRes = await this.parseService.createList(url);
    const result = [];
    if (listRes.success) {
      const originData = listRes.data;
      originData[0].children.forEach(p => {
        p.children && p.children.forEach(v => {
          result.push(`${v.id} ${v.description}`);
        });
      });
    }
    return result;
  }

  @Post('build')
  async BuildCodeWithParam(@Body() { template, include, url, getFormatter, postFormatter }: BuildCodeDto): Promise<BackFormatterDto> {
    let codes = [];
    // 模板内容
    codes = [...this.parseService.createTemplateCodes(template)];
    const listRes = await this.parseService.createList(url);
    if (listRes.success) {
      const originData = listRes.data;
      const selectedData = this.parseService.filterTreeWithIds(originData[0].children, include);
      // 单个函数的代码
      selectedData.forEach(item => {
        const single = this.parseService.createSingleInstance(getFormatter, postFormatter, item);
        codes = codes.concat(single);
        codes.push('\n');
      });
      return this.backFormatter.getResult(true, '成功生成代码', codes.join('\n'));
    }
    return listRes;
  }
  @Post('android')
  async postSwaggerMapJsonForAndroid(@Body() { url, include }: { url: string, include: string[] }): Promise<BackFormatterDto> {
    const json = {
      code: 0,
      errMsg: '正常返回',
      data: [],
    };
    const listRes = await this.parseService.createList(url);
    if (listRes.success) {
      const originData = listRes.data;
      const selectedData = this.parseService.filterTreeWithIds(originData[0].children, include);
      selectedData.forEach(item => {
        json.data.push(this.parseService.createSingleAndroidInfo(item));
      });
      return this.backFormatter.getResult(true, '成功生成安卓JSON', json);
    }
    json.code = 500;
    json.errMsg = '请求不到Swagger地址';
    return this.backFormatter.getResult(false, '生成安卓JSON失败', json);
  }
  @Get('android')
  async getSwaggerMapJsonForAndroid(@Query() { url }: { url: string }): Promise<BackFormatterDto> {
    const data = [];
    const listRes = await this.parseService.createList(url);
    if (listRes.success) {
      const originData = listRes.data;
      // 获取所有单条接口的数据
      let allData = [];
      Object.values(originData[0].children).forEach(value => {
        // tslint:disable-next-line: no-string-literal
        allData = [].concat(allData, Object.values(value['children']));
      });
      allData.forEach(item => {
        data.push(this.parseService.createSingleAndroidInfo(item));
      });
      return this.backFormatter.getResult(true, '成功生成安卓JSON', data);
    }
    return this.backFormatter.getResult(false, '请求不到swaggerjson', data);
  }
}
