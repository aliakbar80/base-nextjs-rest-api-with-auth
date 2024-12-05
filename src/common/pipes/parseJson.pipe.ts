import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform<string, object> {
  transform(value: string): object {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new BadRequestException('JSON وارد شده معتبر نیست.');
    }
  }
}
