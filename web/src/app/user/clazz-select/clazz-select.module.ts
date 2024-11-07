import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClazzSelectComponent} from './clazz-select.component';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzCascaderModule} from 'ng-zorro-antd/cascader';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [ClazzSelectComponent],
  imports: [
    CommonModule,
    NzSelectModule,
    NzCascaderModule,
    ReactiveFormsModule
  ],
  exports: [
    ClazzSelectComponent
  ]
})
export class ClazzSelectModule { }
