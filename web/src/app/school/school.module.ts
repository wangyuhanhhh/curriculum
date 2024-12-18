import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddComponent} from './add/add.component';
import {RouterModule, Routes} from '@angular/router';
import {SchoolComponent} from './school.component';
import {EditComponent} from './edit/edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PageModule} from '../clazz/page/page.module';
import {AdminComponent} from './admin/admin.component';
import {NzSelectModule} from 'ng-zorro-antd/select';

// routes是常量，它的类型是Routes
const routes: Routes = [
  {
    path: '',
    component: SchoolComponent
  },
  {
    path: 'add',
    component: AddComponent
  },
  {
    path: 'edit/:id',
    component: EditComponent
  },
  {
    path: 'setAdmin/:id',
    component: AdminComponent
  }
];
@NgModule({
  declarations: [
    SchoolComponent,
    AddComponent,
    EditComponent,
    AdminComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), // 不是根模块，使用forChild
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PageModule,
    NzSelectModule
  ]
})
export class SchoolModule {}
