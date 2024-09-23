import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TermComponent} from './term/term.component';

const routes: Routes = [
  {
    path: 'term',
    component: TermComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
