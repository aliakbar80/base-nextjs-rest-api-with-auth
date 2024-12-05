import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class LengthValidationPipe implements PipeTransform<string> {
  constructor(private minLength: number, private maxLength: number) {}

  transform(value: string): string {
    if (value.length < this.minLength || value.length > this.maxLength) {
      throw new BadRequestException(
        `طول رشته باید بین ${this.minLength} و ${this.maxLength} باشد.`,
      );
    }
    return value;
  }
}
