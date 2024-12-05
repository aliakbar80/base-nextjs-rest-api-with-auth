import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class NotEmptyPipe implements PipeTransform<any, any> {
  transform(value: any): any {
    if (value === null || value === undefined || value === '') {
      throw new BadRequestException('مقدار نمی‌تواند خالی باشد.');
    }
    return value;
  }
}
