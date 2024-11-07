import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Course} from '../app/entity/course';
import {Page} from '../app/entity/page';
import {ResponseBody} from '../app/entity/response-body';

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

  // 删除
  delete(courseInfoId: number): Observable<ResponseBody> {
    return this.httpClient.delete<ResponseBody>(`${this.baseUrl}/delete/${courseInfoId}`);
  }

  // 根据id获取课程信息
  getCourseById(params: HttpParams): Observable<Course> {
    return this.httpClient.get<Course>(`${this.baseUrl}/getCourseById/`, { params });
  }

  // 根据周数获取当前学生的课表
  getCourseTableByWeek(params: HttpParams): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/getCourseTableByWeek/`, { params });
  }

  // 获取当前学期的课程表(所有课程安排)
  getAllCourseByStudent(): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}/getAllCourseByStudent`);
  }

  // 查询对应班级的学期总课表
  getAllCourseByClazz(clazzId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/getAllCourseByClazz/${clazzId}`);
  }
  // 获取当前登录用户的信息及学期
  getMessage(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/getMessage`);
  }

  // 查询
  search(params: HttpParams): Observable<Page<Course>> {
    return this.httpClient.get<Page<Course>>(`${this.baseUrl}/search`, {params});
  }

  // 更新
  update(courseInfoId: number, course: Course): Observable<ResponseBody> {
    return this.httpClient.put<ResponseBody>(`${this.baseUrl}/update/${courseInfoId}`, course);
  }
}
