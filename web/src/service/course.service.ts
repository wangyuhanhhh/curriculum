import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Course} from "../app/entity/course";
import {Page} from "../app/entity/page";
import {ResponseBody} from "../app/entity/response-body";

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = '/api/course';
  constructor(private httpClient: HttpClient ) {
  }

  // 新增
  add(course: Course): Observable<ResponseBody> {
    return this.httpClient.post<ResponseBody>(`${this.baseUrl}/add`, course);
  }

  // 检查该用户下是否有激活的学期
  checkTerm(): Observable<ResponseBody> {
    return this.httpClient.get<ResponseBody>(`${this.baseUrl}/checkTerm`);
  }
  // 获取当前登录用户的信息及学期
  getMessage(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/getMessage`);
  }

  // 查询
  search(params: HttpParams): Observable<Page<Course>> {
    return this.httpClient.get<Page<Course>>(`${this.baseUrl}/search`, {params})
  }
}
