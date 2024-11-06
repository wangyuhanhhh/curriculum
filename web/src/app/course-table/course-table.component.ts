import { Component, OnInit } from '@angular/core';
import {Person} from '../entity/person';
import {LoginService} from '../../service/login.service';


@Component({
  selector: 'app-course-table',
  templateUrl: './course-table.component.html',
  styleUrls: ['./course-table.component.css']
})
export class CourseTableComponent implements OnInit {
  person = {} as Person;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.getRole();
  }

  // 获取当前登录用户的角色
  getRole(): void {
    this.loginService.getCurrentUser().subscribe(user => {
      if (user) {
        const jsonString = user;
        // @ts-ignore
        const userdata = JSON.parse(jsonString);
        this.person.role = userdata.role;
      }
    });
  }
}
