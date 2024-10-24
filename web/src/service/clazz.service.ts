import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Clazz} from '../app/entity/clazz';
import {ResponseBody} from '../app/entity/response-body';
import { Page } from 'src/app/entity/page';

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

  // 删除班级
  delete(clazzId: number): Observable<ResponseBody> {
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${clazzId}`);
  }

  // 获取所有的班级
  getAll(): Observable<Clazz[]> {
    return this.httpClient.get<Clazz[]>(this.baseUrl);
  }

  // 根据schoolId获取班级
  getClazzBySchoolId(schoolId: number): Observable<Clazz[]> {
    return this.httpClient.get<Clazz[]>(`${this.baseUrl}/getClazzBySchoolId/${schoolId}`);
  }

  // 根据id获取对应的班级信息 根据学校id获取对应的教师信息
  // 因为从后台传过来的数据，包括班级信息和教师信息，所以这里使用any
  getMessage(params: HttpParams): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/getMessage/`, { params });
  }

  // 根据id获取对应的班级信息
  getClazzById(id: number): Observable<Clazz> {
    return this.httpClient.get<Clazz>(`${this.baseUrl}/getClazzById/${id}`);
  }

  // 查询
  search(params: HttpParams): Observable<Page<Clazz>> {
    return this.httpClient.get<Page<Clazz>>(`${this.baseUrl}/search`, { params });
  }

  // 保存教师
  saveTeacher(id: number, teacherId: number): Observable<ResponseBody> {
    return this.httpClient.put<ResponseBody>(`${this.baseUrl}/saveTeacher/${id}`, teacherId);
  }

  // 更新班级信息
  update(id: number, clazz: Clazz): Observable<ResponseBody> {
    return this.httpClient.put<ResponseBody>(`${this.baseUrl}/update/${id}`, clazz);
  }
}
