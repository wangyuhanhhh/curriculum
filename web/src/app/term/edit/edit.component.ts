import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TermService} from '../../../service/term.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Term} from '../../entity/term';
import {HttpClient} from '@angular/common/http';
import {School} from '../../entity/school';
import {Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';

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
    start_time: new FormControl(null, Validators.required),
    end_time: new FormControl(null, Validators.required),
    school_id: new FormControl(null, Validators.required),
  });

  constructor(private activeRoute: ActivatedRoute,
              private termSeries: TermService,
              private httpClient: HttpClient,
              private router: Router,
              private commonService: CommonService){
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
    this.termSeries.edit(id).subscribe((term) => {
      this.formGroup.patchValue({
        // 填充信息（编辑前的学期信息）
        term: term.term,
        end_time: term.end_time,
        start_time: term.start_time,
        school_id: term.school_id
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
    // 判断 startTime和end_time是不是Date对象
    // 如果是Date对象，说明前台改动了；如果不是Date对象，说明前台没有改动，直接赋值，不需要调用getTime方法
    if (term.end_time instanceof Date) {
      term.end_time = term.end_time.getTime();
    }
    if (term.start_time instanceof Date) {
      term.start_time = term.start_time.getTime();
    }

    this.termSeries.update(id, term).subscribe(
      responseBody => {
        console.log(responseBody.success);
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

  disableEndDate = (endDate: Date): boolean => {
    const time = endDate.getTime();
    return this.formGroup.get('start_time')?.value.getTime() > time;
  }
}
