import { Component, OnInit } from '@angular/core';
import {StudentService} from '../../service/student.service';
import {Student} from '../entity/student';
import {ClazzService} from '../../service/clazz.service';
import {Clazz} from '../entity/clazz';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  users: Student[] = [];
  clazzes: Clazz[] = [];

  constructor(private studentService: StudentService,
              private clazzService: ClazzService) { }

  ngOnInit(): void {
    this.studentService.getAll().subscribe(
      users => this.users = users
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
}
