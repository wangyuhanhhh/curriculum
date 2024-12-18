import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ClazzService} from '../../../service/clazz.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../service/common.service';
import {LoginService} from '../../../service/login.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  school: string;
  formGroup = new FormGroup({
    clazz: new FormControl('', Validators.required)
  });

  constructor(private activeRoute: ActivatedRoute,
              private clazzService: ClazzService,
              private commonService: CommonService,
              private router: Router,
              private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.getCurrentUser().subscribe(user => {
      const role = user.role;
      console.log(role);
      if (role !== 0 && role !== 1) {
        this.router.navigate(['dashboard']);
      }
    }, error => this.commonService.showErrorAlert('当前登录用户数据获取失败'));
    // 获取要更新数据的id
    const id = this.activeRoute.snapshot.params.id;
    this.clazzService.getClazzById(id).subscribe(data => {
      // 填充编辑前的信息
      this.formGroup.patchValue({
        clazz: data.clazz
      });
      this.school = data.school.school;
    }, error => console.log(error));
  }

  onSubmit(): void {
    const id = this.activeRoute.snapshot.params.id;
    const editClazz = this.formGroup.value;
    this.clazzService.update(id, editClazz).subscribe(data => {
      if (data.success) {
        this.commonService.showSuccessAlert(data.message);
        this.router.navigate(['/clazz']);
      } else {
        this.commonService.showErrorAlert(data.message);
      }
    }, error => console.log(error));
  }
}
