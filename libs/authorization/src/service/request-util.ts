import {HttpParams} from '@angular/common/http';
import { SearchWithPagination } from '../data-access/page-size';

export const createRequestOption = <T extends SearchWithPagination>(req?: T): HttpParams => {
  let options: HttpParams = new HttpParams();

  if (req) {
    Object.keys(req).forEach((key: string) => {
      const val = req[key as keyof T];
      if (key !== 'sort' && val !== null && val !== undefined) {
        options = options.set(key, <string | number>val);
      }
    });

    if (req.sort) {
      req.sort.forEach((val: string) => {
        options = options.append('sort', val);
      });
    }
  }
  return options;
};
