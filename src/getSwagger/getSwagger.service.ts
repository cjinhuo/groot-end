import { Injectable, HttpService } from '@nestjs/common';
import GetSwaggerInterFace from './interfaces/getSwagger.interface';
import { BackFormatter } from '../Common/BackFormatter';
import { Utils } from '../Common/utils';

@Injectable()
export class GetSwaggerService implements GetSwaggerInterFace {
  constructor(private readonly httpService: HttpService,
              private readonly backFormatter: BackFormatter,
              private readonly utils: Utils) { }
  async getSwaggerWithUrl(url: string): Promise<any> {
    try {
      const finalUrl = this.utils.resolveSwaggerUrl(url);
      const res = await this.httpService.get(finalUrl).toPromise();
      return this.backFormatter.getResult(true, '请求成功', res.data);
    } catch (error) {
      return this.backFormatter.getResult(false, `请求错误失败${error}`, null);
    }
  }
  async getNestSwaggerWithUrl(url: string): Promise<any> {
    try {
      const finalUrl = this.utils.resolveNestSwaggerUrl(url);
      const res = await this.httpService.get(finalUrl).toPromise();
      const re = /"swaggerDoc": ((.|\n)*),\s*"customOptions"/;
      // 获取鹰眼swagger-ui-init.js中的swagger json
      const data = JSON.parse(( res.data as unknown as string).match(re)[1]);
      return this.backFormatter.getResult(true, '请求成功', data);
    } catch (error) {
      return this.backFormatter.getResult(false, `请求NestSwagger错误失败${error}`, null);
    }
  }
}
