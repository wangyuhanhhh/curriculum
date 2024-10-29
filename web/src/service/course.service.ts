import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Course} from "../app/entity/course";
import {Page} from "../app/entity/page";

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = '/api/course';
  constructor(private httpClient: HttpClient ) {
  }
  // 查询
  search(params: HttpParams): Observable<Page<Course>> {
    return this.httpClient.get<Page<Course>>(`${this.baseUrl}/search`, {params})
  }
}
