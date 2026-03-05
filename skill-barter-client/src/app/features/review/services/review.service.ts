import { inject, Injectable } from '@angular/core';
import { ReviewDto } from '../dtos/review.dto';
import { Observable } from 'rxjs';
import { Review } from '../../../common/models/review.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly apiUrl = `${environment.api}/reviews`;
  private readonly httpClient = inject(HttpClient);

  create(reviewDto: ReviewDto): Observable<Review> {
    return this.httpClient.post<Review>(this.apiUrl, reviewDto);
  }
}
