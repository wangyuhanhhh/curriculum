import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TeacherSelectComponent} from './teacher-select.component';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [TeacherSelectComponent],
  imports: [
    CommonModule,
    NzSelectModule,
    ReactiveFormsModule
  ],
  exports: [
    TeacherSelectComponent
  ]
})
export class TeacherSelectModule { }
