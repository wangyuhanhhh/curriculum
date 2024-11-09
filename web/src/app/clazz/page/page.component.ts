import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {Page} from '../../entity/page';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  pageData: Page<any> = new Page({
    content: [],
    number: 1,
    size: 5,
    numberOfElements: 0,
    totalPages: 0
  });
  currentPage: number;
  size: number;

  constructor() {
  }

  // 父组件想要的输出：某个被点击的页码
  @Output()
  beCurrentPageChange = new EventEmitter<number>();
  @Output()
  beSizeChange = new EventEmitter<number>();

  @Input()
  set page(page: Page<any>) {
    this.pageData = page;
  }

  // 从父组件中获取当前页
  @Input()
  set current(currentPage: number) {
    this.currentPage = currentPage;
  }

  ngOnInit(): void {
  }

  // 更新组件内部状态并通过@Output传递给父组件
  onPage(currentPage: number): void {
    this.beCurrentPageChange.emit(currentPage);
  }

  onSize(size: number): void {
    this.beSizeChange.emit(size);
  }
}
