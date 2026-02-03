import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CategoryFilterDto } from './dtos/category-filter.dto';
import { Observable } from 'rxjs/internal/Observable';
import { Category } from '../../common/models/category.model';
import { PageResponse } from '../../common/interfaces/page-result.interface';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl = `${environment.api}/categories`;
  private readonly httpClient = inject(HttpClient);

  get(categoryFilterDto: CategoryFilterDto, isAdmin = false): Observable<PageResponse<Category>> {
    let params = new HttpParams();
    Object.keys(categoryFilterDto).forEach((key) => {
      const value = categoryFilterDto[key as keyof CategoryFilterDto];
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });
    return this.httpClient.get<PageResponse<Category>>(this.apiUrl + (isAdmin ? '/admin' : ''), {
      params,
    });
  }
}
