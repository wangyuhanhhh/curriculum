import { Component, OnInit } from '@angular/core';
import {Teacher} from '../entity/teacher';
import {TeacherService} from '../../service/teacher.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  teachers = [] as Teacher[];

  constructor(private teacherService: TeacherService) { }

  ngOnInit(): void {
    this.getAll();
  }

  // 获取所有教师
  getAll(): void {
    this.teacherService.getAll().subscribe(
      teachers => this.teachers = teachers
    );
  }

}
