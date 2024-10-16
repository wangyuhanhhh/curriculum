import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserComponent} from './user/user.component';

const routes: Routes = [
  {
    path: 'term',
    loadChildren: () => import('./term/term.module').then(m => m.TermModule)
  },
  {
    path: 'school',
    loadChildren: () => import('./school/school.module').then(m => m.SchoolModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'clazz',
    loadChildren: () => import('./clazz/clazz.module').then(m => m.ClazzModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
