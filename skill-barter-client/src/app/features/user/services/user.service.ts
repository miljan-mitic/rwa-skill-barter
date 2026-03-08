import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../../common/models/user.model';
import { UserUpdateDto } from '../dtos/user-update.dto';
import { UserFilterDto } from '../dtos/user-filter.dto';
import { PageResponse } from '../../../common/interfaces/page-result.interface';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = `${environment.api}/users`;
  private readonly httpClient = inject(HttpClient);

  updateProfile(userUpdateDto: UserUpdateDto): Observable<User> {
    return this.httpClient.patch<User>(`${this.apiUrl}/profile`, userUpdateDto);
  }

  get(userFilterDto: UserFilterDto): Observable<PageResponse<User>> {
    let params = new HttpParams();
    Object.keys(userFilterDto).forEach((key) => {
      const value = userFilterDto[key as keyof UserFilterDto];
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });
    return this.httpClient.get<PageResponse<User>>(this.apiUrl, { params });
  }
}
