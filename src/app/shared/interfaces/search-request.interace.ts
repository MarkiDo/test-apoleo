import { HttpParams } from '@angular/common/http';

export interface SearchRequestParams {
  select: string;
  skip?: number;
  limit?: number;
  q?: string;
  sortBy?: string;
  order?: string;
}
