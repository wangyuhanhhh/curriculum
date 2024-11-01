import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ClazzService} from '../../../service/clazz.service';
import {CommonService} from '../../../service/common.service';
import {Observable} from 'rxjs';
import {HttpParams} from "@angular/common/http";
import {Teacher} from "../../entity/teacher";

@Component({
  selector: 'app-head-teacher',
  templateUrl: './head-teacher.component.html',
  styleUrls: ['./head-teacher.component.css']
})
export class HeadTeacherComponent implements OnInit {
  school: string;
  clazz: string;
  teachers = [] as Teacher[];
  formGroup = new FormGroup({
    teacherId: new FormControl(null, Validators.required)
  });
  constructor(private activateRoute: ActivatedRoute,
              private clazzService: ClazzService,
              private commonService: CommonService,
              private router: Router) {
              }

  ngOnInit(): void {
    // 获取班级id 后台查询出班级对应的学校 填充表单
    // 获取学校id 学校id要从后台查询 后台查询出符合条件的教师
    const id = this.activateRoute.snapshot.params.id;
    const schoolId = this.activateRoute.snapshot.params.schoolId;
    const httpParams = new HttpParams()
      .append('id', id)
      .append('schoolId', schoolId);
    this.clazzService.getMessage(httpParams).subscribe( data => {
      this.school = data.school.school;
      this.clazz = data.clazz;
      this.teachers = data.teachers;
      // 为表单设置默认值
      if (data.teacher_id) {
        this.formGroup.patchValue({
          teacherId: data.teacher_id,
        })
      }
    }, error => console.log(error));
  }

  // 保存 要传id（确保是哪个班级的班主任） 传teachrId作为要更新的内容
  onSubmit(): void {
    const id = this.activateRoute.snapshot.params.id;
    const teacherId = this.formGroup.value.teacherId;
    console.log('点击保存按钮',teacherId);
    // 保存对应的teacher_id到数据表中
    this.clazzService.saveTeacher(id, teacherId).subscribe(data => {
      if (data.success) {
        this.commonService.showSuccessAlert(data.message);
        this.router.navigate(['/clazz']);
      } else {
        this.commonService.showErrorAlert(data.message);
      }
    }, error => console.log(error));
  }
}
