import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import {RouterModule} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserModule } from './user/user.module';
import { SchoolModule } from './school/school.module';
import { TermModule } from './term/term.module';
import { ClazzModule } from './clazz/clazz.module';
import { TeacherModule } from './teacher/teacher.module';
import { LoginComponent } from './login/login.component';
import { XAuthTokenInterceptor } from '../interceptor/x-auth-token.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { NavComponent } from './layout/nav/nav.component';
import { PersonalCenterComponent } from './personal-center/personal-center.component';
import { HeaderComponent } from './layout/header/header.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LayoutComponent,
    NavComponent,
    PersonalCenterComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NzDatePickerModule,
    RouterModule,
    ReactiveFormsModule,
    UserModule,
    SchoolModule,
    TermModule,
    ClazzModule,
    TeacherModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    // 注册拦截器
    { provide: HTTP_INTERCEPTORS, useClass: XAuthTokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
