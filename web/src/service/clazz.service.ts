import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Clazz} from '../app/entity/clazz';
import {ResponseBody} from '../app/entity/response-body';

@Injectable({
  providedIn: 'root'
})
export class ClazzService {
  private baseUrl = '/api/clazz';
  constructor(private httpClient: HttpClient) {
  }
  // 新增
  add(clazz: Clazz): Observable<ResponseBody> {
    return this.httpClient.post<ResponseBody>(`${this.baseUrl}/add`, clazz);
  }
  // 获取所有的班级
  getAll(): Observable<Clazz[]> {
    return this.httpClient.get<Clazz[]>(this.baseUrl);
  }
}
