import { Injectable } from '@nestjs/common';

@Injectable()
export class BackFormatter {
  getResult(success: boolean, message: string, data: any): object {
    return {
      success,
      message,
      data,
    };
  }
}
