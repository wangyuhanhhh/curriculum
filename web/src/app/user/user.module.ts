import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserComponent} from './user.component';
import {AddComponent} from './add/add.component';
import {RouterModule, Routes} from '@angular/router';
import {NzCascaderModule} from 'ng-zorro-antd/cascader';
import {ReactiveFormsModule} from '@angular/forms';
import { SchoolSelectComponent } from './school-select/school-select.component';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {SchoolSelectModule} from './school-select/school-select.module';

const routes: Routes = [
  {
    path: '',
    component: UserComponent
  },
  {
    path: 'add',
    component: AddComponent
  }
];


@NgModule({
  declarations: [
    UserComponent,
    AddComponent,
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        SchoolSelectModule
    ]
})
export class UserModule { }
