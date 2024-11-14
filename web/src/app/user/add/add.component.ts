import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../service/common.service';
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
    student_no: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    school_id: new FormControl(null, Validators.required),
    clazz_id: new FormControl(null, Validators.required),
  });

  constructor(private studentService: UserService,
              private commonService: CommonService,
              private router: Router,
              private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.getCurrentUser().subscribe(user => {
      const role = user.role;
      if (role === 3) {
        this.router.navigate(['dashboard']);
      }
    }, error => this.commonService.showErrorAlert('当前登录用户数据获取失败'));
  }

  onSubmit(): void {
    const student = this.formGroup.value;
    this.studentService.add(student).subscribe(
      responseBody => {
        console.log(responseBody.message);
        if (responseBody.success) {
          this.commonService.showSuccessAlert(responseBody.message);
          // 重定向到 user.component.html 页面
          this.router.navigate(['/user']);
        } else {
          this.commonService.showErrorAlert(responseBody.message);
        }
      }, error => {
        this.commonService.showErrorAlert('请求失败，请稍后再试');
      }
    );
  }

  // tslint:disable-next-line:typedef
  get studentNo() {
    return this.formGroup.get('student_no');
  }
}
