import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../service/user.service';
import {ClazzService} from '../../../service/clazz.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {School} from '../../entity/school';
import {Clazz} from '../../entity/clazz';
import {SchoolService} from '../../../service/school.service';


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
    role: new FormControl(null, Validators.required),
  });

  constructor(private userService: UserService,
              private clazzService: ClazzService,
              private schoolService: SchoolService) { }

  ngOnInit(): void {
    // this.subscribeSchoolIdValueChange();
  }

  // subscribeSchoolIdValueChange(): void {
  //   this.formGroup.get('school_id').valueChanges.subscribe((value: number) => {
  //   });
  // }

  onSubmit(): void {
    console.log('点击了保存按钮');
  }

}
