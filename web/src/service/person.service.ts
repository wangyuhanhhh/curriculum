import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseBody } from '../app/entity/response-body';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http: HttpClient) { }
  private baseUrl = '/api/user';

  // 修改密码
  changePassword(params: HttpParams): Observable<ResponseBody> {
    return this.http.get<ResponseBody>(`${this.baseUrl}/changePassword`, { params });
  }

}
