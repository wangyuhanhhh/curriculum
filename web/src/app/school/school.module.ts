import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddComponent} from './add/add.component';
import {RouterModule, Routes} from '@angular/router';
import {SchoolComponent} from './school.component';

// routes是常量，它的类型是Routes
const routes: Routes = [
  {
    path: '',
    component: SchoolComponent
  },
  {
    path: 'add',
    component: AddComponent,
  }
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes) // 不是根模块，使用forChild
  ]
})
export class SchoolModule {}
