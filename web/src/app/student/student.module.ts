import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StudentComponent} from './student.component';
import {AddComponent} from './add/add.component';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { ClazzSelectComponent } from './clazz-select/clazz-select.component';
import {SchoolSelectModule} from './school-select/school-select.module';


const routes: Routes = [
  {
    path: '',
    component: StudentComponent
  },
  {
    path: 'add',
    component: AddComponent
  }
];


@NgModule({
  declarations: [
    StudentComponent,
    AddComponent,
    ClazzSelectComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        SchoolSelectModule
    ]
})
export class StudentModule { }
