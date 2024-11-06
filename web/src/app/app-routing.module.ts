import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { PersonalCenterComponent } from './personal-center/personal-center.component';
import {CourseTableComponent} from './course-table/course-table.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
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
      },
      {
        path: 'teacher',
        loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule)
      },
      {
        path: 'course',
        loadChildren: () => import('./course/course.module').then(m => m.CourseModule)
      },
      {
        path: 'personal-center',
        component: PersonalCenterComponent
      },
      {
        path: 'course-table',
        loadChildren: () => import('./course-table/course-table.module').then(m => m.CourseTableModule)
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
