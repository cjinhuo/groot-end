import { Injectable } from '@nestjs/common';
import { BackFormatterDto } from './common.dto';

@Injectable()
export class BackFormatter {
  getResult(success: boolean, message: string, data: any): BackFormatterDto {
    return {
      success,
      message,
      data,
    };
  }
}
