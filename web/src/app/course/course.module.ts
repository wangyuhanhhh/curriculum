import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CourseComponent} from './course.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PageModule} from '../clazz/page/page.module';
import {NzSelectModule} from 'ng-zorro-antd/select';
import { AddComponent } from './add/add.component';
import {SchoolSelectModule} from '../user/school-select/school-select.module';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: CourseComponent
  },
  {
    path: 'add',
    component: AddComponent
  },
  {
    path: 'edit/:id/:courseInfoId',
    component: EditComponent
  }
];

@NgModule({
  declarations: [
    CourseComponent,
    AddComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    PageModule,
    ReactiveFormsModule,
    NzSelectModule,
    SchoolSelectModule,
    NzRadioModule
  ]
})
export class CourseModule { }
