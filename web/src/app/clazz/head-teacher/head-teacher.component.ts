import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ClazzService} from '../../../service/clazz.service';
import {CommonService} from '../../../service/common.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-head-teacher',
  templateUrl: './head-teacher.component.html',
  styleUrls: ['./head-teacher.component.css']
})
export class HeadTeacherComponent implements OnInit {
  school: string;
  schoolId: number;
  clazz: string;
  schoolId$: Observable<number>;
  formGroup = new FormGroup({
    teacherId: new FormControl(null, Validators.required)
  });
  constructor(private activateRoute: ActivatedRoute,
              private clazzService: ClazzService,
              private commonService: CommonService,
              private router: Router) { }

  ngOnInit(): void {
    // 获取id 后台查询出班级对应的学校 填充表单
    const id = this.activateRoute.snapshot.params.id;
    this.clazzService.getClazzById(id).subscribe( data => {
      this.school = data.school.school;
      this.schoolId$ = new Observable(observer => {
        observer.next(data.school.id);
        observer.complete();
      });
      this.clazz = data.clazz;
    }, error => console.log(error));
  }
  onSubmit(): void {
    const id = this.activateRoute.snapshot.params.id;
    const teacherId = this.formGroup.value;
    // 保存对应的teacher_id到数据表中
    this.clazzService.saveTeacher(id, teacherId).subscribe(data => {
      if (data.success) {
        this.commonService.showSuccessAlert(data.message);
        this.router.navigate(['/clazz']);
      } else {
        this.commonService.showErrorAlert(data.message);
      }
    }, error => console.log(error));
  }
}
