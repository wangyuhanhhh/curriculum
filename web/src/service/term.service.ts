import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Term} from '../app/entity/term';
import {ResponseBody} from '../app/entity/response-body';
import {Page} from '../app/entity/page';
import {Clazz} from '../app/entity/clazz';

@Injectable({
  providedIn: 'root'
})
export class TermService {
  private baseUrl = '/api/term';

  constructor(private http: HttpClient) { }

  // 获取所有的terms
  getAll(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // 学期新增
  add(termData: { term: string; startTime: number; endTime: number; status: boolean; schoolId: number }): Observable<ResponseBody> {
    // 构建完整的URL
    const addUrl = `${this.baseUrl}/add`;

    // 发送POST请求到后端
    return this.http.post<ResponseBody>(addUrl, termData);
  }

  // 学期的删除
  delete(id: number): Observable<ResponseBody> {
    const deleteUrl = `${this.baseUrl}/delete/${id}`;
    return this.http.delete<any>(deleteUrl);
  }

  edit(id: number): Observable<any> {
    const updateUrl = `${this.baseUrl}/edit/${id}`;
    return this.http.get<any>(updateUrl);
  }
  // 分页
  search(params: HttpParams): Observable<Page<Term>> {
    return this.http.get<Page<Term>>(`${this.baseUrl}/search`, { params });
  }
  update(id: number, termData: Term): Observable<any> {
    const updateUrl = `${this.baseUrl}/update/${id}`;
    return this.http.post(updateUrl, termData);
  }

  // 学期的激活
  active(id: number): Observable<any> {
    const activeUrl = `${this.baseUrl}/active/${id}`;
    return this.http.get<any>(activeUrl);
  }
}
