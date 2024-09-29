import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TermService} from '../../../service/term.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Term} from '../../entity/term';
import {HttpClient} from '@angular/common/http';
import {School} from '../../entity/school';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  schools = new Array<School>();
  term: Term = {} as Term;
  formGroup = new FormGroup({
    term: new FormControl('', Validators.required),
    startTime: new FormControl(null, Validators.required),
    endTime: new FormControl(null, Validators.required),
    status: new FormControl(null, Validators.required),
    schoolId: new FormControl(null, Validators.required),
  });

  constructor(private activeRoute: ActivatedRoute,
              private termSeries: TermService,
              private httpClient: HttpClient,
              private router: Router) {
  }

  ngOnInit(): void {
    // 获取所有学校
    this.httpClient.get<School[]>('http://localhost:8088/api/school/index')
      .subscribe(schoolJson => {
        this.schools = schoolJson;
        console.log(this.schools);
      }, error => {
        console.log(error);
      });

    const id = this.activeRoute.snapshot.params.id;
    this.termSeries.editTerm(id).subscribe((term) => {
      this.formGroup.patchValue({
        // 填充信息（编辑前的学期信息）
        term: term.term,
        status: term.status,
        endTime: term.end_time,
        startTime: term.start_time,
        schoolId: term.school_id
      });
      console.log(this.formGroup.value);
      }, error => console.log('失败', error)
    );
  }

  initFormGroup(): void {

    this.setFormGroup();
  }

  setFormGroup(): void {
    console.log(this.term);
  }

  onSubmit(): void {
    console.log('点击保存按钮');
    const id = this.activeRoute.snapshot.params.id;
    const term = this.formGroup.value;
    // 判断 startTime和endTime是不是Date对象
    // 如果是Date对象，说明前台改动了；如果不是Date对象，说明前台没有改动，直接赋值，不需要调用getTime方法
    if (term.endTime instanceof Date) {
      term.endTime = term.endTime.getTime();
    }
    if (term.startTime instanceof Date) {
      term.startTime = term.startTime.getTime();
    }

    this.termSeries.updateTerm(id, term).subscribe(
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

  disableEndDate = (endDate: Date): boolean => {
    const time = endDate.getTime();
    return this.formGroup.get('startTime')?.value.getTime() > time;
  }
}
