import { Component, OnInit } from '@angular/core';
import {Course} from "../entity/course";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Page} from "../entity/page";
import {HttpParams} from "@angular/common/http";
import {CourseService} from "../../service/course.service";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  course = [] as Course[];
  formGroup = new FormGroup({
    type: new FormControl(''),
    searchCourse: new FormControl(null),
  });
  // 默认显示第一页
  currentPage = 1;
  // 每页默认5条
  size = 5;
  pageData = new Page<Course> ({
    content: [],
    number: 1,
    size: 5,
    numberOfElements: 0,
    totalPages: 0
  })
  constructor(
    private courseService: CourseService) { }

  ngOnInit(): void {
    this.loadByPage();
  }

  // 通用分页加载方法，支持搜索和分页
  loadByPage(currentPage = 1, size = 5): void {
    // 保证用户在搜索框无内容时，点击搜索查询到的结果是所有数据
    const searchType = this.formGroup.get('type')?.value || '';
    const searchCourse = this.formGroup.get('searchCourse')?.value || '';
    const httpParams = new HttpParams()
      .append('type', searchType)
      .append('course', searchCourse)
      .append('currentPage', currentPage.toString())
      .append('size', size.toString());
    this.courseService.search(httpParams).subscribe(
      (data: Page<Course>) => {
        console.log(data);
        this.pageData = data;
        this.currentPage = currentPage;
      },
      error => console.error(error)
    );
  }

  onDelete(id: number): void {
  }

  onSearch(): void {
    this.loadByPage(1, this.size);
  }

  /**
   * loadByPage方法接受两个参数，这里调用loadByPage方法也应该传递两个参数
   */
  onPage(currentPage: number): void {
    this.loadByPage(currentPage, this.size);
  }

  onSize(size: number): void {
    this.size = size;
    this.loadByPage(this.currentPage, size);
  }
}