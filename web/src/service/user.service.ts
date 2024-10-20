import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseBody} from '../app/entity/response-body';
import {User} from '../app/entity/user';
import {Page} from '../app/entity/page';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = '/api/student';

  constructor(private http: HttpClient) { }

  // 新增
  add(studentData: User): Observable<ResponseBody> {
    // 构建完整的URL
    const addUrl = `${this.baseUrl}/add`;

    // 发送POST请求到后端
    return this.http.post<ResponseBody>(addUrl, studentData);
  }

  // 删除
  delete(studentId: number): Observable<ResponseBody> {
    const deleteUrl = `${this.baseUrl}/delete/${studentId}`;
    return this.http.delete<ResponseBody>(deleteUrl);
  }

  // 修改
  edit(id: number): Observable<User> {
    const editUrl = `${this.baseUrl}/edit/${id}`;
    return this.http.get<User>(editUrl);
  }

  // 获取所有用户
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  // 分页查询
  search(params: HttpParams): Observable<Page<User>> {
    return this.http.get<Page<User>>(`${this.baseUrl}/search`, { params });
  }

  update(id: number, studentData: User): Observable<ResponseBody> {
    const updateUrl = `${this.baseUrl}/update/${id}`;
    return this.http.post<ResponseBody>(updateUrl, studentData);
  }

  // 冻结学生
  freeze(id: number): Observable<ResponseBody> {
    const freezeUrl = `${this.baseUrl}/freeze/${id}`;
    return this.http.get<ResponseBody>(freezeUrl);
  }
}
