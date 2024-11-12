import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ClazzService} from '../../../service/clazz.service';
import {CommonService} from '../../../service/common.service';
import {Teacher} from '../../entity/teacher';
import {LoginService} from '../../../service/login.service';

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
              private router: Router,
              private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.loginService.getCurrentUser().subscribe(data => {
      // @ts-ignore
      const user = JSON.parse(data);
      const role = user.role;
      console.log(role);
      if (role !== 0 && role !== 1) {
        this.router.navigate(['dashboard']);
      }
    }, error => this.commonService.showErrorAlert('当前登录用户数据获取失败'));
    // 获取班级id 后台查询出班级对应的学校 填充表单
    // 获取学校id 学校id要从后台查询 后台查询出符合条件的教师
    const id = this.activateRoute.snapshot.params.id;
    this.clazzService.getMessage(id).subscribe( data => {
      this.school = data.school.school;
      this.clazz = data.clazz;
      this.teachers = data.teachers;
      // 为表单设置默认值
      if (data.teacher_id) {
        this.formGroup.patchValue({
          teacherId: data.teacher_id,
        });
      }
    }, error => console.log(error));
  }

  // 保存 要传id（确保是哪个班级的班主任） 传teachrId作为要更新的内容
  onSubmit(): void {
    const id = this.activateRoute.snapshot.params.id;
    const teacherId = this.formGroup.value.teacherId;
    console.log('点击保存按钮', teacherId);
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
