import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddComponent} from './add/add.component';
import {RouterModule, Routes} from '@angular/router';
import {TermComponent} from './term.component';
import { EditComponent } from './edit/edit.component';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {ReactiveFormsModule} from '@angular/forms';

// routes是常量，它的类型是Routes
const routes: Routes = [
  {
    path: '',
    component: TermComponent
  },
  {
    path: 'add',
    component: AddComponent
  },
  {
    path: 'edit/:id',
    component: EditComponent
  }
];
@NgModule({
  declarations: [
    TermComponent,
    AddComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzDatePickerModule,
    ReactiveFormsModule,
    // 不是根模块，使用forChild
  ]
})
export class TermModule { }
