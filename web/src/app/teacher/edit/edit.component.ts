import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TeacherService} from '../../../service/teacher.service';
import {CommonService} from '../../../service/common.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    teacher_no: new FormControl(null, Validators.required),
  });

  constructor(private activeRoute: ActivatedRoute,
              private teacherService: TeacherService,
              private commonService: CommonService,
              private router: Router) { }

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.params.id;
    this.teacherService.getById(id).subscribe((teacher) => {
      this.formGroup.patchValue({
        // 填充信息
        name: teacher.name,
        username: teacher.username,
        teacher_no: teacher.teacher_no,
      });
    }, error => console.log(error));
  }

  onSubmit(): void {
    const id = this.activeRoute.snapshot.params.id;
    const teacher = this.formGroup.value;
    console.log(this.formGroup.value);
    this.teacherService.update(id, teacher).subscribe(
      responseBody => {
        if (responseBody.success) {
          this.commonService.showSuccessAlert(responseBody.message);
          this.router.navigate(['/teacher']);
        } else {
          this.commonService.showErrorAlert(responseBody.message);
        }
      }, error => {
        this.commonService.showErrorAlert('请求失败，请稍后');
      }
    );
  }

}
