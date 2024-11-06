import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseService} from '../../../service/course.service';
import {HttpParams} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../service/common.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  // 该学期的周数范围
  weekRange: number[] = [];
  // 节次
  sections: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  termName: string;
  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    start_weeks: new FormControl(null, Validators.required),
    end_weeks: new FormControl(null, Validators.required),
    week: new FormControl(null, Validators.required),
    begin: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required),
  });

  constructor(private activatedRoute: ActivatedRoute,
              private courseService: CourseService,
              private commonService: CommonService,
              private router: Router) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params.id;
    const courseInfoId = this.activatedRoute.snapshot.params.courseInfoId;
    const httpParams = new HttpParams()
      .append('id', id)
      .append('courseInfoId', courseInfoId);
    this.courseService.getCourseById(httpParams).subscribe(data => {
      this.weekRange = data.weeks;
      this.termName = data.term.term;
      this.formGroup.patchValue({
        name: data.name,
        type: data.type,
        status: data.status,
        start_weeks: data.start_weeks,
        end_weeks: data.end_weeks,
        week: data.week,
        begin: data.begin,
        end: data.end,
      });
    }, error => console.log(error));
  }

  onSubmit(): void {
    const courseInfoId = this.activatedRoute.snapshot.params.courseInfoId;
    const course = this.formGroup.value;
    this.courseService.update(courseInfoId, course).subscribe( data => {
      console.log(data);
      if (data.success) {
        this.commonService.showSuccessAlert(data.message);
        this.router.navigate(['/course']);
      } else {
        this.commonService.showErrorAlert(data.message);
      }
    }, error => console.log(error));
  }

  isWeekDisabled(week: number): boolean {
    const status = this.formGroup.get('status')?.value;
    if (status === '1') {
      // 禁用单周
      return week % 2 !== 0;
    }
    if (status === '2') {
      // 禁用双周
      return week % 2 === 0;
    }
    // 全周，所有的都可用
    return false;
  }
}
