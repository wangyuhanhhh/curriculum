import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../service/login.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../service/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username = '';

  constructor(private loginService: LoginService,
              private commonService: CommonService,
              private router: Router) { }

  ngOnInit(): void {
    this.loginService.getCurrentUser().subscribe(user => {
      if (user) {
        const jsonString = user;
        // @ts-ignore
        const userdata = JSON.parse(jsonString);
        this.username = userdata.username;
      }
    });
  }

  onLogout(): void {

    this.loginService.logout().subscribe(
      responseBody => {
        if (responseBody.success) {
          this.commonService.showSuccessAlert(responseBody.message);

          // 重定向到登录页面
          this.router.navigate(['/login']);
        } else {
          this.commonService.showErrorAlert(responseBody.message);
        }
      }, error => this.commonService.showErrorAlert('请求失败。请稍后')
    );
  }
}
