// custom.d.ts
import { Request } from 'express';

declare module 'express' {
  export interface Request {
    sortBy?: string;
    order?: 'asc' | 'desc';
  }
}
