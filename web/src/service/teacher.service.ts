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

  // 获取所有教师
  getAll(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.baseUrl);
  }
}
