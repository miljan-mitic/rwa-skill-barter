import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BarterFilterDto } from '../dtos/barter-filter.dto';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../common/interfaces/page-result.interface';
import { Barter } from '../../../common/models/barter.model';

@Injectable({ providedIn: 'root' })
export class BarterService {
  private readonly apiUrl = `${environment.api}/barters`;
  private readonly httpClient = inject(HttpClient);

  get(barterFilterDto: BarterFilterDto, isAdmin = false): Observable<PageResponse<Barter>> {
    let params = new HttpParams();
    Object.keys(barterFilterDto).forEach((key) => {
      const value = barterFilterDto[key as keyof BarterFilterDto];
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });
    return this.httpClient.get<PageResponse<Barter>>(this.apiUrl + (isAdmin ? '/admin' : ''), {
      params,
    });
  }

  loadMeetingsStates(barterIds: number[]): Observable<Barter[]> {
    let params = new HttpParams();
    barterIds.forEach((barterId) => {
      params = params.append('ids', barterId.toString());
    });
    return this.httpClient.get<Barter[]>(`${this.apiUrl}/meetings-states`, {
      params,
    });
  }
}
