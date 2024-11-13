import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../../service/login.service';
import {CommonService} from '../../../service/common.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  menus: Array<any> = [
    {
      link: 'dashboard',
      icon: 'fa-solid fa-house',
      name: '首页',
      roles: [0, 1, 2, 3, 4],
      exact: true,
    },
    {
      link: 'school',
      icon: 'fas fa-university',
      name: '学校管理',
      roles: [0, 1, 2, 4],
      exact: false,
    },
    {
      link: 'term',
      icon: 'fa-solid fa-calendar-days',
      name: '学期管理',
      roles: [0, 1, 2, 3, 4],
      exact: false,
    },
    {
      link: 'teacher',
      icon: 'fa fa-users',
      name: '教师管理',
      roles: [0, 1],
      exact: false,
    },
    {
      link: 'clazz',
      icon: 'fa fa-graduation-cap',
      name: '班级管理',
      roles: [0, 1],
      exact: false,
    },
    {
      link: 'user',
      icon: 'fa-solid fa-address-book',
      name: '学生管理',
      roles: [0, 1, 2, 4],
      exact: false,
    },
    {
      link: 'course',
      icon: 'fa fa-book',
      name: '课程管理',
      roles: [3],
      exact: false,
    },
    {
      link: 'course-table',
      icon: 'fa-solid fa-layer-group',
      name: '课表查询',
      roles: [0, 1, 2, 3, 4],
      exact: false,
    },
    {
      link: 'personal-center',
      icon: 'fa-solid fa-circle-user',
      name: '个人中心',
      roles: [0, 1, 2, 3, 4],
      exact: false,
    }
  ];
  filteredMenus: Array<any> = [];
  isLoading = true;

  constructor(private loginService: LoginService,
              private commonService: CommonService) {
  }

  ngOnInit(): void {
    this.loginService.getCurrentUser().subscribe(data => {
        try {
          if (data) {
            console.log(data);
            // @ts-ignore
            const user = JSON.parse(data);
            this.filteredMenus = this.menus.filter(menu => menu.roles.includes(user.role));
          }
        } catch (error) {
          console.log('当前登录用户数据解析失败');
        } finally {
          this.isLoading = false;
        }
      }, error => this.commonService.showErrorAlert('当前登录用户数据获取失败')
    );
  }
}
