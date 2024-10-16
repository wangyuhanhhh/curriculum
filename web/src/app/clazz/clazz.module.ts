import { NgModule } from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {ClazzComponent} from './clazz.component';
import {RouterModule, Routes} from '@angular/router';
import { AddComponent } from './add/add.component';
import {SchoolSelectModule} from '../user/school-select/school-select.module';
import {ReactiveFormsModule} from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import {PageModule} from './page/page.module';

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
  }
];
@NgModule({
  declarations: [
    ClazzComponent,
    AddComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes),
    SchoolSelectModule,
    ReactiveFormsModule,
    PageModule
  ]
})
export class ClazzModule {}
