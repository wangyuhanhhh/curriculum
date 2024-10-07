import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Clazz} from '../app/entity/clazz';

@Injectable({
  providedIn: 'root'
})
export class ClazzService {
  private baseUrl = '/api/clazz';
  constructor(private httpClient: HttpClient) {
  }
  // 获取所有的班级
  getAll(): Observable<Clazz[]> {
    return this.httpClient.get<Clazz[]>(this.baseUrl);
  }

  // 根据schoolId获取班级
  getClazzBySchoolId(schoolId: number): Observable<Clazz[]> {
    return this.httpClient.get<Clazz[]>(`${this.baseUrl}/getClazzBySchoolId/${schoolId}`);
  }
}
