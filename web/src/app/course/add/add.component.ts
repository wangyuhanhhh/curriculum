import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CourseService} from "../../../service/course.service";
import {CommonService} from "../../../service/common.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  weekRange: number[] = [];
  // 节次
  sections: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11];
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

  constructor(
    private courseService: CourseService,
    private commonService: CommonService,
    private router: Router) {
  }

  ngOnInit(): void {
    // 获取学期及周数
    this.courseService.getMessage().subscribe(data => {
      console.log(data);
      this.termName = data.term.term;
      this.weekRange = data.week;
    }, error => console.log(error));
  }

  onSubmit(): void {
    const course = this.formGroup.value;
    this.courseService.add(course).subscribe(data => {
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
