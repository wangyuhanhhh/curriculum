import { Component, OnInit } from '@angular/core';
import {StudentService} from '../../../service/student.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../service/common.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    student_no: new FormControl(null, Validators.required),
    school_id: new FormControl(null, Validators.required),
    clazz_id: new FormControl(null, Validators.required),
  });
  constructor(private studentService: StudentService,
              private commonService: CommonService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const student = this.formGroup.value;
    this.studentService.add(student).subscribe(
      responseBody => {
        console.log(responseBody.message);
        if (responseBody.success) {
          this.commonService.showSuccessAlert(responseBody.message);
          // 重定向到 student.component.html 页面
          this.router.navigate(['/student']);
        } else {
          this.commonService.showErrorAlert(responseBody.message);
        }
      }, error => {
        this.commonService.showErrorAlert('请求失败，请稍后再试');
      }
    );
  }

}
