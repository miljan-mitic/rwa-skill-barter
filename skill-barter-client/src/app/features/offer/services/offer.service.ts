import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer } from '../../../common/models/offer.model';
import { OfferFilterDto } from '../dtos/offer-filter.dto';

@Injectable({ providedIn: 'root' })
export class OfferService {
  private readonly apiUrl = `${environment.api}/offers`;
  private readonly httpClient = inject(HttpClient);

  get(
    offerFilterDto: OfferFilterDto,
    isAdmin = false
  ): Observable<{ offers: Offer[]; length: number }> {
    let params = new HttpParams();
    Object.keys(offerFilterDto).forEach((key) => {
      const value = offerFilterDto[key as keyof OfferFilterDto];
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });
    return this.httpClient.get<{ offers: Offer[]; length: number }>(
      this.apiUrl + (isAdmin ? '/admin' : ''),
      {
        params,
      }
    );
  }
}
