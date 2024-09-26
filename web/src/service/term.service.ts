import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TermService {
  private baseUrl = '/api/term';

  constructor(private http: HttpClient) { }

  // 获取所有的terms
  getAllTerms(): Observable<any> {
    return this.http.get(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  // 学期新增
  addTerm(termData: any): Observable<any> {
    // 构建完整的URL
    const addUrl = `${this.baseUrl}/add`;

    // 发送POST请求到后端
    return this.http.post<any>(addUrl, termData);
  }

  // 错误处理
  // tslint:disable-next-line:typedef
  private handleError(error: any) {
    return throwError(error.massage || 'Server Error');
  }
}
