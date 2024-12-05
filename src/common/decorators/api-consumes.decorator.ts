import { applyDecorators } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';

export function ApiConsumesGlobal(...types: ('multipart/form-data' | 'application/json')[]) {
  return applyDecorators(ApiConsumes(...types));
}
