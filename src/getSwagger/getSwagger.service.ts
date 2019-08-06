import { Injectable, HttpService } from '@nestjs/common';
import GetSwaggerInterFace from './interfaces/getSwagger.interface';
import { BackFormatter } from '../Common/BackFormatter';

@Injectable()
export class GetSwaggerService implements GetSwaggerInterFace {
  constructor(private readonly httpService: HttpService, private readonly backFormatter: BackFormatter) { }
  async getSwaggerWithUrl(url: string): Promise<any> {
    const res = await this.httpService.get(url).toPromise();
    if (res.status >= 200 && res.status < 300) {
      return res.data;
    }
    return this.backFormatter.getResult(false, '请求错误失败', null);
  }
}
