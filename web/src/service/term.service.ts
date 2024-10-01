import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Term} from '../app/entity/term';
import {ResponseBody} from '../app/entity/response-body';

@Injectable({
  providedIn: 'root'
})
export class TermService {
  private baseUrl = '/api/term';

  constructor(private http: HttpClient) { }

  // 获取所有的terms
  getAllTerms(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // 学期新增
  addTerm(termData: { term: string; startTime: number; endTime: number; status: boolean; schoolId: number }): Observable<ResponseBody> {
    // 构建完整的URL
    const addUrl = `${this.baseUrl}/add`;

    // 发送POST请求到后端
    return this.http.post<ResponseBody>(addUrl, termData);
  }

  editTerm(id: number): Observable<any> {
    const updateUrl = `${this.baseUrl}/edit/${id}`;
    return this.http.get<any>(updateUrl);
  }

  updateTerm(id: number, termData: Term): Observable<any> {
    const updateUrl = `${this.baseUrl}/update/${id}`;
    return this.http.post(updateUrl, termData);
  }

  // 学期的激活
  activeTerm(id: number): Observable<any> {
    const activeUrl = `${this.baseUrl}/active/${id}`;
    return this.http.get<any>(activeUrl);
  }
}
