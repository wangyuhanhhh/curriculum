import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = '/api/user';

  constructor(private http: HttpClient) { }

  // 获取所有用户
  getAllUsers(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
}
