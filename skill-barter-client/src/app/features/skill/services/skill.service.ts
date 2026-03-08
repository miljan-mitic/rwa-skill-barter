import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SkillFilterDto } from '../dtos/skill-filter.dto';
import { SkillDto } from '../dtos/skill.dto';
import { Observable } from 'rxjs';
import { Skill } from '../../../common/models/skill.model';
import { PageResponse } from '../../../common/interfaces/page-result.interface';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private readonly apiUrl = `${environment.api}/skills`;
  private readonly httpClient = inject(HttpClient);

  get(skillFilterDto: SkillFilterDto): Observable<PageResponse<Skill>> {
    let params = new HttpParams();
    Object.keys(skillFilterDto).forEach((key) => {
      const value = skillFilterDto[key as keyof SkillFilterDto];
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });
    return this.httpClient.get<PageResponse<Skill>>(this.apiUrl, {
      params,
    });
  }

  create(skillDto: SkillDto): Observable<Skill> {
    return this.httpClient.post<Skill>(this.apiUrl, skillDto);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
