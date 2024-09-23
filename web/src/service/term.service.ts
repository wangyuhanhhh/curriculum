import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TermService {
  private baseUrl = 'http://localhost:8088/api/term';

  constructor(private http: HttpClient) { }

  // 获取所有的terms
  getAllTerms(): Observable<any> {
    return this.http.get(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  // 错误处理
  // tslint:disable-next-line:typedef
  private handleError(error: any) {
    return throwError(error.massage || 'Server Error');
  }
}
