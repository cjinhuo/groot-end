import { Injectable } from '@nestjs/common';
import ParseInterface from './interfaces/parse.interface';

@Injectable()
export class ParseService implements ParseInterface {
  createList(url: string, prefix: string): object {
    return {};
  }
  createCodes(): string {
    return '';
  }
  createInstance(): string {
    return '';
  }
}
