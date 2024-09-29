import { Component, OnInit } from '@angular/core';
import { TermService } from '../../../service/term.service';
import Swal from 'sweetalert2';
import { Term } from '../../entity/term';
import { School } from '../../entity/school';
import { HttpClient } from '@angular/common/http';
import {ControlValueAccessor, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  formGroup = new FormGroup({
    term: new FormControl('', [Validators.required, Validators.minLength(6)]),
    start_time: new FormControl(null, Validators.required),
    end_time: new FormControl(null, Validators.required),
    status: new FormControl(null, Validators.required),
    school_id: new FormControl(null, Validators.required),
  });
  term = {} as Term;
  schools = new Array<School>();

  constructor(private termService: TermService,
              private httpClient: HttpClient,
              private router: Router) { }

  ngOnInit(): void {
    // 获取所有学校
    this.httpClient.get<School[]>('http://localhost:8088/api/school/index')
      .subscribe(schoolJson => {
        this.schools = schoolJson;
        console.log(this.schools);
      }, error => {
        console.log(error);
      });
  }

  disableEndDate = (endDate: Date): boolean => {
    const time = endDate.getTime();
    return this.formGroup.get('start_time')?.value.getTime() > time;
  }

  onSubmit(): void {
    const term = this.formGroup.value;
    term.end_time = term.end_time.getTime();
    term.start_time = term.start_time.getTime();
    this.termService.addTerm(term).subscribe(
      response => {
        console.log(response.success);
        // 根据服务器返回的响应来显示成功或失败的弹窗
        if (response.success) {
          this.showSuccessAlert(response.message);
          // 新增成功，重定向到 term.component.html 对应的路由
          this.router.navigate(['/term']);
        } else {
          this.showErrorAlert(response.message);
        }
      },
      error => {
        // 处理HTTP错误
        this.showErrorAlert('请求失败，请稍后再试');
      }
    );
  }

  // 显示成功弹窗
  private showSuccessAlert(message: string): void {
    Swal.fire({
      icon: 'success',
      title: '成功',
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
