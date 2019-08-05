import { Injectable } from '@nestjs/common';
import ParseInterface from './interfaces/parse.interface';
import { BackFormatter } from '../Utils/BackFormatter';

@Injectable()
export class ParseService implements ParseInterface {
  createList(url: string, prefix: string): object {
    const currentUrl = encodeURIComponent(url);
    const root = {
      id: 'root',
      label: '全选',
      children: [],
    };

    const backFormatter = new BackFormatter();
    return backFormatter.getResult(true, '成功返回', [{
      test: 1,
    }]);
  }
  createCodes(): string {
    return '';
  }
  createInstance(): string {
    return '';
  }
}
