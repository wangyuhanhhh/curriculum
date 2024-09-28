import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TermComponent } from './term/term.component';
import { SchoolComponent } from './school/school.component';
import { HttpClientModule } from '@angular/common/http';
import { AddComponent as SchoolAddComponent} from './school/add/add.component';
import { AddComponent as TermAddComponent } from './term/add/add.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import {RouterModule} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    TermComponent,
    SchoolComponent,
    SchoolAddComponent,
    TermAddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NzDatePickerModule,
    RouterModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
