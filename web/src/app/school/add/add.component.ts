import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {School} from '../../entity/school';
import {SchoolService} from '../../../service/school.service';
import Swal from 'sweetalert2';
import {CommonService} from '../../../service/common.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  // 新增的学校
  addSchool = {
    school: '' as string,
  } as School;
  constructor(private schoolService: SchoolService,
              private commonService: CommonService,
              private router: Router) { }

  ngOnInit(): void {
  }
  onSubmit(): void {
    // 向后台发起http请求
    this.schoolService.add(this.addSchool)
      .subscribe(data => {
        if (data.success) {
          this.commonService.showSuccessAlert(data.message);
          this.router.navigateByUrl('/school');
        } else {
          this.commonService.showErrorAlert(data.message);
        }
      },
      error => console.log('保存失败', error));
  }
}
