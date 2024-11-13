import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ClazzService} from '../../../service/clazz.service';
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
    clazz: new FormControl('', Validators.required),
    school_id: new FormControl(null, Validators.required)
  });

  constructor(private clazzService: ClazzService,
              private commonService: CommonService,
              private router: Router,
              private loginService: LoginService) {}

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
    const addClazz = this.formGroup.value;
    // 向后台发起http请求
    this.clazzService.add(addClazz).subscribe(data => {
      if (data.success) {
        this.commonService.showSuccessAlert(data.message);
        this.router.navigate(['/clazz']);
      } else {
        this.commonService.showErrorAlert(data.message);
      }
    }, error => {
      console.log(error);
    });
  }

}
