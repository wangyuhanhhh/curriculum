import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseBody} from '../app/entity/response-body';
import {User} from '../app/entity/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
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
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  update(id: number, studentData: User): Observable<any> {
    const updateUrl = `${this.baseUrl}/update/${id}`;
    return this.http.post(updateUrl, studentData);
  }

  // 冻结学生
  freeze(id: number): Observable<any> {
    const freezeUrl = `${this.baseUrl}/freeze/${id}`;
    return this.http.get<any>(freezeUrl);
  }
}
