import { Component, OnInit } from '@angular/core';
import {Teacher} from '../entity/teacher';
import {TeacherService} from '../../service/teacher.service';
import {HttpParams} from '@angular/common/http';
import {Page} from '../entity/page';
import {CommonService} from '../../service/common.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  teachers = [] as Teacher[];
  // 默认显示第一页
  currentPage = 1;
  // 每页默认10条
  size = 5;
  pageData = new Page<Teacher> ({
    content: [],
    number: 1,
    size: 5,
    numberOfElements: 0,
    totalPages: 0
  });

  constructor(private teacherService: TeacherService,
              private commonService: CommonService) { }

  ngOnInit(): void {
    this.getAll();
    this.loadByPage();
  }
  loadByPage(currentPage = 1, size = 5): void {
    // 后台请求
    const httpParams = new HttpParams().append('currentPage', currentPage.toString())
      .append('size', size.toString());
    this.teacherService.loadByPage(httpParams).subscribe(data => {
      this.pageData = data;
      this.currentPage = currentPage;
    }, error => console.log(error));
  }
  // 获取所有教师
  getAll(): void {
    this.teacherService.getAll().subscribe(
      teachers => this.teachers = teachers
    );
  }

  /**
   * loadByPage方法接受两个参数，这里调用loadByPage方法也应该传递两个参数
   */
  onPage(currentPage: number): void {
    this.loadByPage(currentPage, this.size);
  }
  onSize(size: number): void {
    this.loadByPage(this.currentPage, size);
  }


  onDelete(teacherId: number): void {
    this.commonService.showConfirmAlert(() => {
      this.teacherService.delete(teacherId)
        .subscribe((responseBody) => {
          if (responseBody.success) {
            this.commonService.showSuccessAlert(responseBody.message);
            this.getAll();
          } else {
            this.commonService.showErrorAlert(responseBody.message);
          }
        }, error => this.commonService.showErrorAlert('请求失败，请稍后'));
    }, '是否删除，此操作不可逆');
  }
}
