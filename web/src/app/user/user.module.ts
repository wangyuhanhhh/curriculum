import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserComponent} from './user.component';
import {AddComponent} from './add/add.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ClazzSelectComponent } from './clazz-select/clazz-select.component';
import {SchoolSelectModule} from './school-select/school-select.module';
import {NzSelectModule} from 'ng-zorro-antd/select';
import { EditComponent } from './edit/edit.component';
import {PageModule} from '../clazz/page/page.module';


const routes: Routes = [
  {
    path: '',
    component: UserComponent
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
    UserComponent,
    AddComponent,
    ClazzSelectComponent,
    EditComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        SchoolSelectModule,
        NzSelectModule,
        PageModule,
        FormsModule
    ]
})
export class UserModule { }
