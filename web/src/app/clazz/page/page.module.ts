import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page.component';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';



@NgModule({
  declarations: [PageComponent],
  imports: [
    CommonModule,
    NzPaginationModule
  ],
  exports: [PageComponent]
})
export class PageModule { }
