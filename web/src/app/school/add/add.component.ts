import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {School} from '../../entity/school';
import {SchoolService} from '../../../service/school.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  // 新增的学校
  addSchool = {
    school: ''
  } as School;
  constructor(private schoolService: SchoolService,
              private router: Router) { }

  ngOnInit(): void {
  }
  onSubmit(): void {
    // 向后台发起http请求
    this.schoolService.add(this.addSchool)
      .subscribe(data => {
        if (data.success) {
          this.showSuccessAlert(data.message);
          this.router.navigateByUrl('/school');
        } else {
          this.showErrorAlert(data.message);
        }
      },
      error => console.log('保存失败', error));
  }
  // 显示成功弹窗
  private showSuccessAlert(message: string): void {
    Swal.fire({
      icon: 'success',
      title: '新增成功',
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  }
  // 显示失败弹窗
  private showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: '错误',
      text: message
    });
  }
}
