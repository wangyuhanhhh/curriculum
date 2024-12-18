import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../../service/login.service';
import {CommonService} from '../../service/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  showPassword = false;
  constructor(private router: Router,
              private loginService: LoginService,
              private commonService: CommonService,
             ) {}

  ngOnInit(): void {
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    this.loginService.login(this.username, this.password).subscribe(
      response => {
        if (response.body.success) {
          // 登录成功后，跳转到 dashboard 页面
          this.commonService.showSuccessAlert(response.body.message);
          this.router.navigate(['/dashboard']);
        } else {
          this.commonService.showErrorAlert(response.body.message);
        }
      }, error => this.commonService.showErrorAlert('请求失败，请稍后')
    );
  }
}
