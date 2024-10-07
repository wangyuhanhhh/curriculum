import { Component, OnInit } from '@angular/core';
import {Clazz} from '../../entity/clazz';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ClazzService} from '../../../service/clazz.service';
import {CommonService} from '../../../service/common.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  addClazz = {
    clazz: '' as string,
    school_id: 0
  } as Clazz;
  formGroup = new FormGroup({
    clazz: new FormControl('', Validators.required),
    school_id: new FormControl(null, Validators.required)
  });
  constructor(private clazzService: ClazzService,
              private commonService: CommonService,
              private router: Router) {}

  ngOnInit(): void {
  }
  onSubmit(): void {
    this.addClazz = this.formGroup.value;
    // 向后台发起http请求
    this.clazzService.add(this.addClazz).subscribe(data => {
      if (data.success) {
        this.commonService.showSuccessAlert(data.message);
        this.router.navigateByUrl('/clazz');
      } else {
        this.commonService.showErrorAlert(data.message);
      }
    }, error => {
      console.log(error);
    });
  }

}
