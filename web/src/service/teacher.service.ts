import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResponseBody} from '../app/entity/response-body';
import {Observable} from 'rxjs';
import {Teacher} from '../app/entity/teacher';


@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private baseUrl = '/api/teacher';

  constructor(private http: HttpClient) { }

  // 新增
  add(teacherData: Teacher): Observable<ResponseBody> {
    const addUrl = `${this.baseUrl}/add`;
    return this.http.post<ResponseBody>(addUrl, teacherData);
  }

  // 删除
  delete(teacherId: number): Observable<ResponseBody> {
    const deleteUrl = `${this.baseUrl}/delete/${teacherId}`;
    return this.http.delete<any>(deleteUrl);
  }

  // 编辑
  update(id: number, teacher: Teacher): Observable<ResponseBody> {
    const editUrl = `${this.baseUrl}/update/${id}`;
    return this.http.put<ResponseBody>(editUrl, teacher);
  }

  // 获取所有教师
  getAll(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.baseUrl);
  }

  // 根据id获取对应教师
  getById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.baseUrl}/getByID/${id}`);
  }
}
