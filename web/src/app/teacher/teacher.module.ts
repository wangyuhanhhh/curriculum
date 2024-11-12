import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TeacherComponent} from './teacher.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import {PageModule} from '../clazz/page/page.module';
import {SchoolSelectModule} from '../user/school-select/school-select.module';


const routes: Routes = [
  {
    path: '',
    component: TeacherComponent
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
    TeacherComponent,
    AddComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormsModule,
    PageModule,
    SchoolSelectModule
  ]
})
export class TeacherModule { }
