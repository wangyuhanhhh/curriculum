import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {TeacherComponent} from './teacher.component';
import { AddComponent } from './add/add.component';


const routes: Routes = [
  {
    path: '',
    component: TeacherComponent
  },
  {
    path: 'add',
    component: AddComponent
  }
];


@NgModule({
  declarations: [
    TeacherComponent,
    AddComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class TeacherModule { }
