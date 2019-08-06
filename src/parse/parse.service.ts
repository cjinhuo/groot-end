import { Injectable, HttpService } from '@nestjs/common';
import ParseInterface from './interfaces/parse.interface';
import { BackFormatter } from '../Common/BackFormatter';
import { request } from 'express';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class ParseService implements ParseInterface {
  constructor(private readonly httpService: HttpService) {}
  createList(url: string, prefix: string): Observable<AxiosResponse> {
    const currentUrl = encodeURIComponent(url);
    const root = {
      id: 'root',
      label: 'å…¨é€‰',
      children: [],
    };
    return this.httpService.get('http://test-simba-ops.startdtapi.com/v2/api-docs');
  }
  createCodes(): string {
    return '';
  }
  createInstance(): string {
    return '';
  }
}
