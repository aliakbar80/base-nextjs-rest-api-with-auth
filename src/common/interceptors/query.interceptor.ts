import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class QueryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const query = request.query;
    const url = request.url;

    const limit = parseInt(query.limit, 10) || 10;
    const offset = parseInt(query.offset, 10) || 0;
    const sortBy = query.sortBy || null;
    const order = query.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const search = query.search || null;

    request.query.limit = limit;
    request.query.offset = offset;
    request.query.sortBy = sortBy;
    request.query.order = order;
    request.query.search = search;

    const skipUrls = ['/api/v1/classes/search'];

    return next.handle().pipe(
      map((data) => {
        if(skipUrls.includes(url)) {
          return data;
        }
        if (!Array.isArray(data)) {
          return data;
        }

        let filteredData = data;

        if (search) {
          filteredData = filteredData.filter((item) =>
            Object.values(item).some((value) => {
              return JSON.stringify(value)
                .toLowerCase()
                .includes(search.toLowerCase());
            }),
          );
        }

        if (sortBy) {
          filteredData.sort((a, b) => {
            const comparison =
              a[sortBy] > b[sortBy] ? 1 : a[sortBy] < b[sortBy] ? -1 : 0;
            return order === 'DESC' ? -comparison : comparison;
          });
        }

        const totalCount = filteredData.length;
        const paginatedData = filteredData.slice(offset, offset + limit);

        const result = {
          items: paginatedData,
          total: totalCount,
          limit,
          offset,
          nextUrl:
            offset + limit < totalCount
              ? `${url}?limit=${limit}&offset=${offset + limit}&sortBy=${sortBy}&order=${order}&search=${search}`
              : null,
          prevUrl:
            offset - limit >= 0
              ? `${url}?limit=${limit}&offset=${offset - limit}&sortBy=${sortBy}&order=${order}&search=${search}`
              : null,
        };

        return result;
      }),
    );
  }
}
