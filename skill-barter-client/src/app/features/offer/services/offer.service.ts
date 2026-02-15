import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer } from '../../../common/models/offer.model';
import { OfferFilterDto } from '../dtos/offer-filter.dto';
import { PageResponse } from '../../../common/interfaces/page-result.interface';
import { OfferDto } from '../dtos/offer.dto';
import { OfferUpdateDto } from '../dtos/offer-update.dto';

@Injectable({ providedIn: 'root' })
export class OfferService {
  private readonly apiUrl = `${environment.api}/offers`;
  private readonly httpClient = inject(HttpClient);

  create(offerDto: OfferDto): Observable<Offer> {
    return this.httpClient.post<Offer>(this.apiUrl, offerDto);
  }

  update(id: number, offerUpdateDto: OfferUpdateDto): Observable<Offer> {
    return this.httpClient.patch<Offer>(`${this.apiUrl}/${id}`, offerUpdateDto);
  }

  get(offerFilterDto: OfferFilterDto, isAdmin = false): Observable<PageResponse<Offer>> {
    let params = new HttpParams();
    Object.keys(offerFilterDto).forEach((key) => {
      const value = offerFilterDto[key as keyof OfferFilterDto];
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });
    return this.httpClient.get<PageResponse<Offer>>(this.apiUrl + (isAdmin ? '/admin' : ''), {
      params,
    });
  }

  getById(id: number, isAdmin = false): Observable<Offer> {
    return this.httpClient.get<Offer>(`${this.apiUrl}/${id}` + (isAdmin ? '/admin' : ''));
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
