import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';

export function UseFileAndAnyContent() {
  return applyDecorators(
    ApiConsumes('multipart/form-data', 'application/json'),
    UseInterceptors(NoFilesInterceptor()),
  );
}
