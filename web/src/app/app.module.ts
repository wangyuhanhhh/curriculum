import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TermComponent } from './term/term.component';
import { SchoolComponent } from './school/school.component';

@NgModule({
  declarations: [
    AppComponent,
    TermComponent,
    SchoolComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
