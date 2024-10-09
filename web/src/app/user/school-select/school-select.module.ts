import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SchoolSelectComponent} from './school-select.component';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzCascaderModule} from 'ng-zorro-antd/cascader';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [SchoolSelectComponent],
  imports: [
    CommonModule,
    NzSelectModule,
    NzCascaderModule,
    ReactiveFormsModule
  ],
  exports: [
    SchoolSelectComponent
  ]
})
export class SchoolSelectModule { }
