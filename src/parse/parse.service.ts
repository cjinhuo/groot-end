import { Injectable, HttpService } from '@nestjs/common';
import ParseInterface from './interfaces/parse.interface';
import { BackFormatter } from '../Common/BackFormatter';
import { request } from 'express';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { GetSwaggerService } from '../getSwagger/getSwagger.service';

@Injectable()
export class ParseService implements ParseInterface {
  constructor(private readonly getSwaggerService: GetSwaggerService) {}
  async createList(url: string): Promise<any> {
    const root = {
      id: 'root',
      label: 'å…¨é€‰',
      children: [],
    };
    const res = await this.getSwaggerService.getSwaggerWithUrl(url);
    return res;
  }
  createCodes(): string {
    return '';
  }
  createInstance(): string {
    return '';
  }
}
