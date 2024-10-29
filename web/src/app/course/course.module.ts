import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CourseComponent} from "./course.component";
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PageModule} from "../clazz/page/page.module";
import {NzSelectModule} from "ng-zorro-antd/select";

const routes: Routes = [
  {
    path: '',
    component: CourseComponent
  }
]

@NgModule({
  declarations: [
    CourseComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    PageModule,
    ReactiveFormsModule,
    NzSelectModule
  ]
})
export class CourseModule { }
