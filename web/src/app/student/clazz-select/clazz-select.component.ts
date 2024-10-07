import {Component, Input, OnInit, forwardRef} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ClazzService} from '../../../service/clazz.service';
import {Clazz} from '../../entity/clazz';

@Component({
  selector: 'app-clazz-select',
  templateUrl: './clazz-select.component.html',
  styleUrls: ['./clazz-select.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ClazzSelectComponent),
    multi: true
  }]
})
export class ClazzSelectComponent implements OnInit, ControlValueAccessor {
  // 本地的 FormControl
  clazzIdControl = new FormControl();
  clazzes: Clazz[];

  @Input() set setSchoolId(schoolId: number) {
    console.log('setSchoolId:', schoolId);
    this.getAllClazzBySchoolId(schoolId);
  }

  constructor(private clazzService: ClazzService) {
  }

  getAllClazzBySchoolId(schoolId: number): void {
    this.clazzService.getClazzBySchoolId(schoolId).subscribe(clazzes => {
      this.clazzIdControl.setValue(null); // 清空选择器中的值
      this.clazzes = clazzes as Clazz[];
    });
  }


  ngOnInit(): void {
  }

  registerOnChange(fn: any): void {
    //  当本地 FormControl 的值变化时，通知父组件
    this.clazzIdControl.valueChanges.subscribe((value: number) => {
      console.log('Clazz ID changed:', value);
      fn(value);
    });
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(clazzId: number): void {
    // 当父组件的 formControl 值发生变化时调用，更新本地的 FormControl
    console.log('set clazzId:', clazzId);
    this.clazzIdControl.setValue(clazzId);
  }
}
