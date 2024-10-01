import { Component, OnInit } from '@angular/core';
import { TermService } from '../../../service/term.service';
import { Term } from '../../entity/term';
import { School } from '../../entity/school';
import { HttpClient } from '@angular/common/http';
import {ControlValueAccessor, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {CommonService} from '../../../service/common.service';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  formGroup = new FormGroup({
    term: new FormControl('', Validators.required),
    start_time: new FormControl(null, Validators.required),
    end_time: new FormControl(null, Validators.required),
    school_id: new FormControl(null, Validators.required),
  });
  term = {} as Term;
  schools = new Array<School>();

  constructor(private termService: TermService,
              private httpClient: HttpClient,
              private router: Router,
              private commonService: CommonService) { }

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
      responseBody => {
        console.log(responseBody.message);
        // 根据服务器返回的响应来显示成功或失败的弹窗
        if (responseBody.success) {
          this.commonService.showSuccessAlert(responseBody.message);
          // 新增成功，重定向到 term.component.html 对应的路由
          this.router.navigate(['/term']);
        } else {
          this.commonService.showErrorAlert(responseBody.message);
        }
      },
      error => {
        // 处理HTTP错误
        this.commonService.showErrorAlert('请求失败，请稍后再试');
      }
    );
  }
}
