import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StudentComponent} from './student.component';
import {AddComponent} from './add/add.component';
import {RouterModule, Routes} from '@angular/router';
import {NzCascaderModule} from 'ng-zorro-antd/cascader';
import {ReactiveFormsModule} from '@angular/forms';
import { SchoolSelectComponent } from './school-select/school-select.component';
import {NzSelectModule} from 'ng-zorro-antd/select';
import { ClazzSelectComponent } from './clazz-select/clazz-select.component';

const routes: Routes = [
  {
    path: '',
    component: StudentComponent
  },
  {
    path: 'add',
    component: AddComponent
  }
];


@NgModule({
  declarations: [
    StudentComponent,
    AddComponent,
    SchoolSelectComponent,
    ClazzSelectComponent
  ],
    imports: [
        CommonModule,
        NzCascaderModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        NzSelectModule
    ]
})
export class StudentModule { }
