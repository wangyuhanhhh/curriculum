import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StudentService} from '../../../service/student.service';
import {CommonService} from '../../../service/common.service';
import {Student} from '../../entity/student';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  student: Student = {} as Student;
  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    student_no: new FormControl(null, Validators.required),
    school_id: new FormControl(null, Validators.required),
    clazz_id: new FormControl(null, Validators.required),
  });

  constructor(private activeRoute: ActivatedRoute,
              private studentService: StudentService,
              private commonService: CommonService,
              private router: Router) { }

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.params.id;
    console.log(id, '获取到的学生id');
    this.studentService.edit(id).subscribe((student) => {
      this.formGroup.patchValue({
        // 填充信息
        name: student.name,
        student_no: student.student_no,
        clazz_id: student.clazz_id,
        school_id: student.school_id,
      });
      console.log(this.formGroup.value);
    }, error => {
      console.log(error);
    });
  }

  onSubmit(): void {
    console.log('点击保存按钮');
    const id = this.activeRoute.snapshot.params.id;
    const student = this.formGroup.value;
    console.log('修改后的学生信息:', student);
    this.studentService.update(id, student).subscribe(
      responseBody => {
        if (responseBody.success) {
          this.commonService.showSuccessAlert(responseBody.message);
          this.router.navigate(['/student']);
        } else {
          this.commonService.showErrorAlert(responseBody.message);
        }
    }, error => {
        this.commonService.showErrorAlert('请求失败，请稍后');
      }
    );
  }

}
