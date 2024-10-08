import { Component, OnInit } from '@angular/core';
import {Clazz} from '../../entity/clazz';
import {ActivatedRoute, Router} from '@angular/router';
import {ClazzService} from '../../../service/clazz.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../service/common.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  editClazz = {
    id: 0,
    clazz: '',
    school_id: 0
  } as Clazz;
  formGroup = new FormGroup({
    clazz: new FormControl('', Validators.required),
    school_id: new FormControl(null, Validators.required)
  });
  constructor(private activeRoute: ActivatedRoute,
              private clazzService: ClazzService,
              private commonService: CommonService,
              private router: Router) { }

  ngOnInit(): void {
    // 获取要更新数据的id
    const id = this.activeRoute.snapshot.params.id;
    this.clazzService.getClazzById(id).subscribe(data => {
      // 填充编辑前的信息
      this.formGroup.patchValue({
        clazz: data.clazz,
        school_id: data.school_id,
      });
    }, error => console.log(error));
  }
  onSubmit(): void {
    const id = this.activeRoute.snapshot.params.id;
    this.editClazz = this.formGroup.value;
    this.clazzService.update(id, this.editClazz).subscribe(data => {
      if (data.success) {
        this.commonService.showSuccessAlert(data.message);
        this.router.navigate(['/clazz']);
      } else {
        this.commonService.showErrorAlert(data.message);
      }
    }, error => console.log(error));
  }
}
