import {Component, forwardRef, Input, OnInit, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Teacher} from '../../entity/teacher';
import {TeacherService} from '../../../service/teacher.service';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-teacher-select',
  templateUrl: './teacher-select.component.html',
  styleUrls: ['./teacher-select.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TeacherSelectComponent),
    multi: true
  }]
})
export class TeacherSelectComponent implements OnInit, ControlValueAccessor {
  teacherIdControl = new FormControl();
  teachers = [] as Teacher[];
  constructor(private teacherService: TeacherService) { }
  // 当前班级对应的学校id
  @Input()
  currentSchoolId = 0;
  // 学校id的值发生变化，调用getTeachers，及时更新学校id值
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentSchoolId) {
      this.getTeachers();
    }
  }
  @Input()
  set setTeacherId(teacherId: number) {
  }
  ngOnInit(): void {
    this.getTeachers();
  }
  getTeachers(): void {
    const schoolId = this.currentSchoolId;
    this.teacherService.getTeacher(schoolId).subscribe(data => {
      console.log(this.currentSchoolId);
      this.teachers = data;
    }, error => console.log('失败'));
  }

  writeValue(teacherId: number): void {
    if (teacherId) {
      this.teacherIdControl.setValue(teacherId);
    }
  }

  registerOnChange(fn: (teacherId: number) => void): void {
    this.teacherIdControl.valueChanges.subscribe((value: number) => {
      fn(value);
    });
  }

  registerOnTouched(fn: any): void {
  }
}
