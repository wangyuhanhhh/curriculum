import { Component, OnInit } from '@angular/core';
import {StudentService} from '../../service/student.service';
import {Student} from '../entity/student';
import {ClazzService} from '../../service/clazz.service';
import {Clazz} from '../entity/clazz';
import {CommonService} from '../../service/common.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  students: Student[] = [];
  clazzes: Clazz[] = [];

  constructor(private studentService: StudentService,
              private clazzService: ClazzService,
              private commonService: CommonService) { }

  ngOnInit(): void {
    this.studentService.getAll().subscribe(
      users => this.students = users
    );

    // 获取所有班级
    this.clazzService.getAll().subscribe(clazzes => {
      this.clazzes = clazzes;
    });
  }

  // 根据clazz_id找到对应班级名称
  getClazzName(clazzId: number): string {
    const clazz = this.clazzes.find(c => c.id === clazzId);
    return clazz ? clazz.clazz : '-';
  }

  onDelete(index: number, id: number): void {
    this.commonService.showConfirmAlert(() => {
      this.studentService.delete(id)
        .subscribe((responseBody) => {
          if (responseBody.success) {
            this.students.splice(index, 1);
            this.commonService.showSuccessAlert(responseBody.message);
          } else {
            this.commonService.showErrorAlert(responseBody.message);
          }
        }, error => this.commonService.showErrorAlert('请求错误，请稍后'));
    }, '是否删除，此操作不可逆');
  }
}
