import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../../common/models/user.model';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = `${environment.api}/users`;
  private readonly httpClient = inject(HttpClient);

  updateProfile(updateUserDto: UpdateUserDto): Observable<User> {
    return this.httpClient.patch<User>(`${this.apiUrl}/profile`, updateUserDto);
  }
}
