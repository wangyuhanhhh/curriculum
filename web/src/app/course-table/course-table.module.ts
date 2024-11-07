import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LookAllComponent} from './student-schedule/look-all/look-all.component';
import {CourseTableComponent} from './course-table.component';
import {StudentScheduleComponent} from './student-schedule/student-schedule.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {TeacherScheduleComponent} from './teacher-schedule/teacher-schedule.component';
import {ClazzSelectModule} from '../user/clazz-select/clazz-select.module';

const routes: Routes = [
  {
    path: '',
    component: CourseTableComponent,
  },
  {
    path: 'look-all',
    component: LookAllComponent
  }
];

@NgModule({
  declarations: [
    LookAllComponent,
    StudentScheduleComponent,
    CourseTableComponent,
    TeacherScheduleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NzSelectModule,
    ClazzSelectModule
  ]
})
export class CourseTableModule { }
