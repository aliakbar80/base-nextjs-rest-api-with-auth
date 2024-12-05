import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function UseQueryFilter() {
  return applyDecorators(
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Limit the number of items returned',
    }),
    ApiQuery({
      name: 'offset',
      required: false,
      type: Number,
      description: 'Offset for pagination',
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      description: 'Sort by a specific field',
    }),
    ApiQuery({
      name: 'order',
      required: false,
      type: String,
      description: 'Order of the sort',
      enum: ['ASC', 'DESC'],
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Search for items',
    }),
  );
}
