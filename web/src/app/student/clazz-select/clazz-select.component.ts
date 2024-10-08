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
  // 用于保存从父组件传入的初始值
  private initialClazzId: number | null = null;
  // 本地的 FormControl
  clazzIdControl = new FormControl();
  clazzes: Clazz[];

  @Input() set setSchoolId(schoolId: number) {
    console.log('setSchoolId:', schoolId);
    // 重新选择学校时，清空 initialClazzId 并且清空选择框
    this.initialClazzId = null; // 清空初始值
    this.clazzIdControl.setValue(null); // 清空班级选择框的值
    this.getAllClazzBySchoolId(schoolId);
  }

  constructor(private clazzService: ClazzService) {
  }

  getAllClazzBySchoolId(schoolId: number): void {
    this.clazzService.getClazzBySchoolId(schoolId).subscribe(clazzes => {
      this.clazzIdControl.setValue(null); // 清空选择器中的值
      this.clazzes = clazzes as Clazz[];

      // 如果父组件传入了初始值 clazz_id， 那么设置
      if (this.initialClazzId) {
        this.clazzIdControl.setValue(this.initialClazzId);
      }
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
    // 保存传入的初始值
    this.initialClazzId = clazzId;

    // 当父组件的 formControl 值发生变化时调用，更新本地的 FormControl
    console.log('set clazzId:', clazzId);
    this.clazzIdControl.setValue(clazzId);
  }
}
