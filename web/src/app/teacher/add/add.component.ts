import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../service/common.service';
import {TeacherService} from '../../../service/teacher.service';
import {Router} from '@angular/router';
import {LoginService} from '../../../service/login.service';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    teacher_no: new FormControl(null, Validators.required),
    school_id: new FormControl(null, Validators.required),
  });

  constructor(private teacherService: TeacherService,
              private commonService: CommonService,
              private router: Router,
              private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.getCurrentUser().subscribe(user => {
      const role = user.role;
      console.log(role);
      if (role !== 0 && role !== 1) {
        this.router.navigate(['dashboard']);
      }
    }, error => this.commonService.showErrorAlert('当前登录用户数据获取失败'));
  }

  onSubmit(): void {
    console.log('点击了保存按钮');
    const teacher = this.formGroup.value;
    this.teacherService.add(teacher).subscribe(
      responseBody => {
        if (responseBody.success) {
          this.commonService.showSuccessAlert(responseBody.message);
          this.router.navigate(['/teacher']);
        } else {
          this.commonService.showErrorAlert(responseBody.message);
        }
      }, error => {
        this.commonService.showErrorAlert('请求失败。请稍后');
      }
    );
  }

}
