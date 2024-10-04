import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClazzComponent} from './clazz.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ClazzComponent
  }
];
@NgModule({
  declarations: [
    ClazzComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes)
  ]
})
export class ClazzModule {}
