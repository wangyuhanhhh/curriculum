import { NgModule } from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {ClazzComponent} from './clazz.component';
import {RouterModule, Routes} from '@angular/router';
import { AddComponent } from './add/add.component';
import {SchoolSelectModule} from '../user/school-select/school-select.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import {PageModule} from './page/page.module';
import {TeacherSelectModule} from './teacher-select/teacher-select.module';
import { HeadTeacherComponent } from './head-teacher/head-teacher.component';

const routes: Routes = [
  {
    path: '',
    component: ClazzComponent
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
    path: 'setHeadTeacher/:id',
    component: HeadTeacherComponent
  }
];
@NgModule({
  declarations: [
    ClazzComponent,
    AddComponent,
    EditComponent,
    HeadTeacherComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes),
    SchoolSelectModule,
    ReactiveFormsModule,
    FormsModule,
    PageModule,
    TeacherSelectModule
  ]
})
export class ClazzModule {}
