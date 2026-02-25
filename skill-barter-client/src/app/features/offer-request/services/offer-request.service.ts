import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../common/interfaces/page-result.interface';
import { OfferRequestDto } from '../dtos/offer-request.dto';
import { OfferRequest } from '../../../common/models/offer-request.model';
import { OfferRequestFilterDto } from '../dtos/offer-request-filter.dto';
import { OfferRequestUpdateDto } from '../dtos/offer-request-update.dto';

@Injectable({ providedIn: 'root' })
export class OfferRequestService {
  private readonly apiUrl = `${environment.api}/offer-requests`;
  private readonly httpClient = inject(HttpClient);

  create(offerRequestDto: OfferRequestDto): Observable<OfferRequest> {
    return this.httpClient.post<OfferRequest>(this.apiUrl, offerRequestDto);
  }

  update(id: number, offerRequestUpdateDto: OfferRequestUpdateDto): Observable<OfferRequest> {
    return this.httpClient.patch<OfferRequest>(`${this.apiUrl}/${id}`, offerRequestUpdateDto);
  }

  get(
    offerRequestFilterDto: OfferRequestFilterDto,
    isAdmin = false,
  ): Observable<PageResponse<OfferRequest>> {
    let params = new HttpParams();
    Object.keys(offerRequestFilterDto).forEach((key) => {
      const value = offerRequestFilterDto[key as keyof OfferRequestFilterDto];
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });
    return this.httpClient.get<PageResponse<OfferRequest>>(
      this.apiUrl + (isAdmin ? '/admin' : ''),
      {
        params,
      },
    );
  }
}
