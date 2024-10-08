import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StudentComponent} from './student.component';
import {AddComponent} from './add/add.component';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { ClazzSelectComponent } from './clazz-select/clazz-select.component';
import {SchoolSelectModule} from './school-select/school-select.module';
import {NzSelectModule} from 'ng-zorro-antd/select';
import { EditComponent } from './edit/edit.component';


const routes: Routes = [
  {
    path: '',
    component: StudentComponent
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
    StudentComponent,
    AddComponent,
    ClazzSelectComponent,
    EditComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        SchoolSelectModule,
        NzSelectModule
    ]
})
export class StudentModule { }
