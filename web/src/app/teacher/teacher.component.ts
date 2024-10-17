import { Component, OnInit } from '@angular/core';
import {Teacher} from '../entity/teacher';
import {TeacherService} from '../../service/teacher.service';
import {CommonService} from '../../service/common.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  teachers = [] as Teacher[];

  constructor(private teacherService: TeacherService,
              private commonService: CommonService) { }

  ngOnInit(): void {
    this.getAll();
  }

  // 获取所有教师
  getAll(): void {
    this.teacherService.getAll().subscribe(
      teachers => this.teachers = teachers
    );
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
