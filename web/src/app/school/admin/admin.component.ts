import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SchoolService} from '../../../service/school.service';
import {Teacher} from '../../entity/teacher';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../service/common.service';
import {LoginService} from '../../../service/login.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  school: string;
  teachers: Teacher[] = [];
  formGroup = new FormGroup({
    teacherId: new FormControl(null, Validators.required)
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private schoolService: SchoolService,
    private commonService: CommonService,
    private router: Router,
    private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.loginService.getCurrentUser().subscribe(data => {
      // @ts-ignore
      const user = JSON.parse(data);
      const role = user.role;
      if (role === 3) {
        this.router.navigate(['dashboard']);
      }
    }, error => this.commonService.showErrorAlert('当前登录用户数据获取失败'));
    const id = this.activatedRoute.snapshot.params.id;
    this.schoolService.getMessage(id).subscribe( data => {
      this.school = data.school;
      this.teachers = data.teachers;
      if (data.teacher_id) {
        this.formGroup.patchValue({
          teacherId: data.teacher_id,
        });
      }
    }, error => console.log(error));
  }

  onSubmit(): void {
    // 获取学校id
    // 获取对应班主任的id
    const id = this.activatedRoute.snapshot.params.id;
    const teacherId = this.formGroup.value.teacherId;
    this.schoolService.saveAdmin(id, teacherId).subscribe( data => {
      if (data.success) {
        this.commonService.showSuccessAlert(data.message);
        this.router.navigate((['/school']));
      } else {
        this.commonService.showErrorAlert(data.message);
      }
    }, error => console.log(error));
  }
}
