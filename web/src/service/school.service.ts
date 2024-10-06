import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {School} from '../app/entity/school';
import {Observable} from 'rxjs';
import {ResponseBody} from '../app/entity/response-body';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private baseUrl = '/api/school';
  constructor(private httpClient: HttpClient) {
  }
  // 新增学校
  add(school: School): Observable<ResponseBody> {
    return this.httpClient.post<ResponseBody>(`${this.baseUrl}/add`, school);
  }
  // 删除学校
  delete(schoolId: number): Observable<ResponseBody> {
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${schoolId}`);
  }
  // 获取所有的学校
  getAll(): Observable<School[]> {
    return this.httpClient.get<School[]>(this.baseUrl);
  }
  // 根据id获取对应的学校
  getSchoolById(id: number): Observable<any> {
    return this.httpClient.get<School>(`${this.baseUrl}/edit/${id}`);
  }
  // 更新学校
  update(id: number, school: School): Observable<ResponseBody> {
    return this.httpClient.put<ResponseBody>(`${this.baseUrl}/update/${id}`, school);
  }
}
