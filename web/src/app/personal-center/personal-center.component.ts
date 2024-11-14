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
  showOldPassword = false;
  showNewPassword = false;

  constructor(private loginService: LoginService,
              private personService: PersonService,
              private commonService: CommonService) { }

  ngOnInit(): void {
    this.loginService.getCurrentUser().subscribe(user => {
      if (user) {
        this.person.name = user.name;
        this.person.username = user.username;
        this.person.role = user.role;
        this.person.no = user.no;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
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
