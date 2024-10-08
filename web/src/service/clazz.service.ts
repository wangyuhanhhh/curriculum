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

  // 根据schoolId获取班级
  getClazzBySchoolId(schoolId: number): Observable<Clazz[]> {
    return this.httpClient.get<Clazz[]>(`${this.baseUrl}/getClazzBySchoolId/${schoolId}`);
  }
  // 根据id获取对应的班级信息
  getClazzById(id: number): Observable<Clazz> {
    return this.httpClient.get<Clazz>(`${this.baseUrl}/edit/${id}`);
  }
  // 更新班级信息
  update(id: number, clazz: Clazz): Observable<ResponseBody> {
    return this.httpClient.put<ResponseBody>(`${this.baseUrl}/update/${id}`, clazz);
  }
}
