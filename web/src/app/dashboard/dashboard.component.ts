import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../service/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private loginService: LoginService,
              private router: Router) { }

  ngOnInit(): void {
    this.loginService.getCurrentUser().subscribe();
    this.loginService.currentLoginUser().subscribe(user => {
        if (!user) {
          // 如果未获取到当前的登录用户，跳转到登录页面
          this.router.navigate(['/login']);
        }
      });
  }

}
