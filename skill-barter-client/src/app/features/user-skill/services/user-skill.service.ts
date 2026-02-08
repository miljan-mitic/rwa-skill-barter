import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../common/interfaces/page-result.interface';
import { UserSkillFilterDto } from '../dtos/user-skill-filter.dto';
import { UserSkill } from '../../../common/models/user-skill.model';
import { UserSkillDto } from '../dtos/user-skill.dto';

@Injectable({ providedIn: 'root' })
export class UserSkillService {
  private readonly apiUrl = `${environment.api}/user-skills`;
  private readonly httpClient = inject(HttpClient);

  create(userSkillDto: UserSkillDto) {
    return this.httpClient.post<UserSkill>(this.apiUrl, userSkillDto);
  }

  get(
    userSkillFilterDto: UserSkillFilterDto,
    isAdmin = false,
  ): Observable<PageResponse<UserSkill>> {
    let params = new HttpParams();
    Object.keys(userSkillFilterDto).forEach((key) => {
      const value = userSkillFilterDto[key as keyof UserSkillFilterDto];
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });
    return this.httpClient.get<PageResponse<UserSkill>>(this.apiUrl + (isAdmin ? '/admin' : ''), {
      params,
    });
  }

  getById(id: number, isAdmin = false): Observable<UserSkill> {
    return this.httpClient.get<UserSkill>(`${this.apiUrl}/${id}` + (isAdmin ? '/admin' : ''));
  }
}
