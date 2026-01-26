import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../common/models/user.model';
import { environment } from '../../../../environments/environment';
import { SignupAuthDto } from '../dtos/signup-auth.dto';
import { LoginAuthDto } from '../dtos/login-auth.dto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.api}/auth`;
  private readonly httpClient = inject(HttpClient);

  signup(signupAuthDto: SignupAuthDto): Observable<{ accessToken: string; user: User }> {
    return this.httpClient.post<{ accessToken: string; user: User }>(
      `${this.apiUrl}/signup`,
      signupAuthDto,
    );
  }

  login(loginAuthDto: LoginAuthDto): Observable<{ accessToken: string; user: User }> {
    return this.httpClient.post<{ accessToken: string; user: User }>(
      `${this.apiUrl}/login`,
      loginAuthDto,
    );
  }

  loginByToken(token: string) {
    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.get<{ user: User; accessToken: string }>(`${this.apiUrl}/auto-login`, {
      headers,
    });
  }
}
