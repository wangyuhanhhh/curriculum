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
  constructor(private router: Router,
              private loginService: LoginService,
              private commonService: CommonService,
             ) {}

  ngOnInit(): void {
  }

  onLogin(): void {
    this.loginService.login(this.username, this.password).subscribe(
      (response: any) => {
        if (response.body.success) {
          // 登录成功后，跳转到 dashboard 页面
          console.log('登录成功！');
          this.router.navigate(['/dashboard']);
        } else {
          this.commonService.showErrorAlert(response.body.message);
        }
      }, error => this.commonService.showErrorAlert('请求失败。请稍后')
    );
  }
}
