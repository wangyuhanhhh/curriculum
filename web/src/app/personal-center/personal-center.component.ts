import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { Person } from '../entity/person';
import {PersonService} from '../../service/person.service';
import {CommonService} from '../../service/common.service';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.css']
})
export class PersonalCenterComponent implements OnInit {
  person = {} as Person;
  oldPassword = '';
  newPassword = '';

  constructor(private loginService: LoginService,
              private personService: PersonService,
              private commonService: CommonService) { }

  ngOnInit(): void {
    this.loginService.getCurrentUser().subscribe();
    this.loginService.currentLoginUser().subscribe(user => {
      if (user) {
        const jsonString = user.data;
        const userdata = JSON.parse(jsonString);
        this.person.name = userdata.name;
        this.person.username = userdata.username;
        this.person.role = userdata.role;
        this.person.no = userdata.no;
      }
    });
  }

  changePassword(): void {
    const httpParams = new HttpParams()
      .append('oldPassword', this.oldPassword)
      .append('newPassword', this.newPassword);

    this.personService.changePassword(httpParams).subscribe(
      responseBody => {
        if (responseBody.success) {
          this.commonService.showSuccessAlert(responseBody.message);
        } else {
          this.commonService.showErrorAlert(responseBody.message);
        }
      }, error => this.commonService.showErrorAlert('请求失败。请稍后')
    );
  }

}
