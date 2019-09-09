import { Controller, Get, Req, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller('hello')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('test')
  test(): string {
    return this.appService.getHello();
  }
}
