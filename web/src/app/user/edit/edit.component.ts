import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../service/user.service';
import {CommonService} from '../../../service/common.service';
import {User} from '../../entity/user';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  user: User = {} as User;
  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    student_no: new FormControl(null, Validators.required),
    school_id: new FormControl(null, Validators.required),
    clazz_id: new FormControl(null, Validators.required),
  });

  constructor(private activeRoute: ActivatedRoute,
              private userService: UserService,
              private commonService: CommonService,
              private router: Router) { }

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.params.id;
    this.userService.edit(id).subscribe((user) => {
      this.formGroup.patchValue({
        // 填充信息
        name: user.name,
        student_no: user.student_no,
        clazz_id: user.clazz_id,
        school_id: user.school_id,
      });
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

}
