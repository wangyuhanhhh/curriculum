import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseBody} from '../app/entity/response-body';
import {Student} from '../app/entity/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = '/api/student';

  constructor(private http: HttpClient) { }

  // 新增
  add(studentData: {username: string; student_no: string; clazz_id: number; }): Observable<ResponseBody> {
    // 构建完整的URL
    const addUrl = `${this.baseUrl}/add`;

    // 发送POST请求到后端
    return this.http.post<ResponseBody>(addUrl, studentData);
  }

  // 删除
  delete(studentId: number): Observable<ResponseBody> {
    const deleteUrl = `${this.baseUrl}/delete/${studentId}`;
    return this.http.delete<any>(deleteUrl);
  }

  // 修改
  edit(id: number): Observable<any> {
    const editUrl = `${this.baseUrl}/edit/${id}`;
    return this.http.get<any>(editUrl);
  }

  // 获取所有用户
  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl);
  }

  update(id: number, studentData: Student): Observable<any> {
    const updateUrl = `${this.baseUrl}/update/${id}`;
    return this.http.post(updateUrl, studentData);
  }
}
