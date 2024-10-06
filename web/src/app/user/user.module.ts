import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserComponent} from './user.component';
import {AddComponent} from './add/add.component';
import {RouterModule, Routes} from '@angular/router';
import {NzCascaderModule} from 'ng-zorro-antd/cascader';
import {ReactiveFormsModule} from '@angular/forms';
import { SchoolSelectComponent } from './school-select/school-select.component';
import {NzSelectModule} from 'ng-zorro-antd/select';

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
    SchoolSelectComponent
  ],
    imports: [
        CommonModule,
        NzCascaderModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        NzSelectModule
    ]
})
export class UserModule { }
