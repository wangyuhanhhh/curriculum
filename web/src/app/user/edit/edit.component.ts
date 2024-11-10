import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../service/user.service';
import {CommonService} from '../../../service/common.service';
import {User} from '../../entity/user';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SchoolService} from '../../../service/school.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  schoolName: '';
  user: User = {} as User;
  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    student_no: new FormControl(null, Validators.required),
    school_id: new FormControl(null, Validators.required),
    clazz_id: new FormControl(null, Validators.required),
  });

  constructor(private activeRoute: ActivatedRoute,
              private userService: UserService,
              private schoolService: SchoolService,
              private commonService: CommonService,
              private router: Router) { }

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.params.id;
    this.userService.edit(id).subscribe((user) => {
      this.formGroup.patchValue({
        // 填充信息
        name: user.name,
        username: user.username,
        student_no: user.student_no,
        clazz_id: user.clazz_id,
        school_id: user.school.id,
      });
      // 调用 getSchoolBySchoolId 方法获取学校名称填充表单
      if (user.school.id) {
        this.getSchoolBySchoolId(user.school.id);
      }
    }, error => {
      console.log(error);
    });
  }

  onSubmit(): void {
    console.log('点击保存按钮');
    const id = this.activeRoute.snapshot.params.id;
    const user = this.formGroup.value;
    this.userService.update(id, user).subscribe(
      responseBody => {
        if (responseBody.success) {
          this.commonService.showSuccessAlert(responseBody.message);
          this.router.navigate(['/user']);
        } else {
          this.commonService.showErrorAlert(responseBody.message);
        }
    }, error => {
        this.commonService.showErrorAlert('请求失败，请稍后');
      }
    );
  }

  // 通过 school_id 获取 school 名称
  getSchoolBySchoolId(schoolId: number): void {
    this.schoolService.getSchoolById(schoolId).subscribe(
      (Data: any) => {
        const schoolName = Data.school;
        if (schoolName) {
          this.schoolName = schoolName || '-';
        }
      }, error => {
        console.log(error);
      }
    );
  }

}
