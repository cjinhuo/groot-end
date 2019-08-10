import { Injectable, HttpService } from '@nestjs/common';
import GetSwaggerInterFace from './interfaces/getSwagger.interface';
import { BackFormatter } from '../Common/BackFormatter';

@Injectable()
export class GetSwaggerService implements GetSwaggerInterFace {
  constructor(private readonly httpService: HttpService, private readonly backFormatter: BackFormatter) { }
  async getSwaggerWithUrl(url: string): Promise<any> {
    try {
      const res = await this.httpService.get(url).toPromise();
      return this.backFormatter.getResult(true, '请求成功', res.data);
    } catch (error) {
      return this.backFormatter.getResult(false, `请求错误失败${error}`, null);
    }
  }
}
