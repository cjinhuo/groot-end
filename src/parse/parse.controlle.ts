import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Header,
  Res,
} from '@nestjs/common';
import { ParseService } from './parse.service';
import { BuildCodeDto } from './dto/parse.dto';
import { Utils } from '../Common/utils';
import { BackFormatter } from '../Common/BackFormatter';
import { BackFormatterDto } from '../Common/common.dto';
import { Stream } from 'stream';

@Controller('parse')
export class ParseController {
  constructor(
    private readonly parseService: ParseService,
    private readonly utils: Utils,
    private readonly backFormatter: BackFormatter,
  ) {}
  @Header('Cache-Control', 'no-cache')
  @Get('list')
  async getTableList(@Query() { url }: { url: string }): Promise<
    BackFormatterDto
  > {
    const res = await this.parseService.createList(url);
    return res;
  }
  // @Header('content-type', 'image/gif')
  // @Get('test')
  // getTest(@Res() res: Response) {
  //   res.headers.set('content-type', 'image/gif');
  //   res.headers.set('content-length', '');
  //   const buf = Buffer.from(
  //     'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
  //     'base64',
  //   );
  //   const stream = new Stream();
  //   // stream
  // }

  @Get('test')
  getTest() {
    return 1;
  }

  @Get('delay')
  async getDelay(): Promise<number> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(11);
      }, 3000);
    });
  }

  @Post('testPost')
  async getPostBody(@Body() body: { message: string }) {
    // tslint:disable-next-line: no-console
    console.log(body);
    return Math.random();
  }

  @Get('listUrls')
  async getListUrls(@Query() { url }: { url: string }): Promise<any> {
    const listRes = await this.parseService.createList(url);
    const result = [];
    if (listRes.success) {
      const originData = listRes.data;
      originData[0].children.forEach(p => {
        // tslint:disable-next-line: no-unused-expression
        p.children &&
          p.children.forEach((v: { id: any; description: any }) => {
            result.push(`${v.id} ${v.description}`);
          });
      });
    }
    return result;
  }

  @Post('build')
  async BuildCodeWithParam(@Body()
  {
    template,
    include,
    url,
    getFormatter,
    postFormatter,
  }: BuildCodeDto): Promise<BackFormatterDto> {
    let codes = [];
    // 模板内容
    codes = [...this.parseService.createTemplateCodes(template)];
    const listRes = await this.parseService.createList(url);
    if (listRes.success) {
      const originData = listRes.data;
      const selectedData = this.parseService.filterTreeWithIds(
        originData[0].children,
        include,
      );
      // 单个函数的代码
      selectedData.forEach(item => {
        const single = this.parseService.createSingleInstance(
          getFormatter,
          postFormatter,
          item,
        );
        codes = codes.concat(single);
        codes.push('\n');
      });
      return this.backFormatter.getResult(
        true,
        '成功生成代码',
        codes.join('\n'),
      );
    }
    return listRes;
  }
  @Post('android')
  async postSwaggerMapJsonForAndroid(@Body()
  {
    url,
    include,
  }: {
    url: string;
    include: string[];
  }): Promise<BackFormatterDto> {
    const json = {
      code: 0,
      errMsg: '正常返回',
      data: [],
    };
    const listRes = await this.parseService.createList(url);
    if (listRes.success) {
      const originData = listRes.data;
      const selectedData = this.parseService.filterTreeWithIds(
        originData[0].children,
        include,
      );
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
  async getSwaggerMapJsonForAndroid(@Query() { url }: { url: string }): Promise<
    BackFormatterDto
  > {
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
