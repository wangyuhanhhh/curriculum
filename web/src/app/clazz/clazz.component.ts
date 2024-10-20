import { Component, OnInit } from '@angular/core';
import {ClazzService} from '../../service/clazz.service';
import {CommonService} from '../../service/common.service';
import { Clazz } from '../entity/clazz';
import {Page} from '../entity/page';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-clazz',
  templateUrl: './clazz.component.html',
  styleUrls: ['./clazz.component.css']
})
export class ClazzComponent implements OnInit {
  clazzes = [] as Clazz[];
  // 默认显示第一页
  currentPage = 1;
  // 每页默认10条
  size = 5;
  pageData = new Page<Clazz> ({
    content: [],
    number: 1,
    size: 5,
    numberOfElements: 0,
    totalPages: 0
  });
  constructor(private clazzService: ClazzService,
              private commonService: CommonService) {
  }
  ngOnInit(): void {
    this.loadByPage();
  }
  loadByPage(currentPage = 1, size = 5): void {
    // 后台请求
    const httpParams = new HttpParams().append('currentPage', currentPage.toString())
      .append('size', size.toString());
    this.clazzService.loadByPage(httpParams).subscribe(data => {
      this.pageData = data;
      this.currentPage = currentPage;
    }, error => console.log(error));
  }
  onDelete(index: number, id: number): void {
    this.commonService.showConfirmAlert(() => {
      this.clazzService.delete(id).subscribe(data => {
        if (data.success) {
          this.clazzes.splice(index, 1);
          this.commonService.showSuccessAlert(data.message);
        } else {
          this.commonService.showErrorAlert(data.message);
        }
      }, error => console.log(error));
    }, '是否删除，此操作不可逆');
  }

  /**
   * loadByPage方法接受两个参数，这里调用loadByPage方法也应该传递两个参数
   */
  onPage(currentPage: number): void {
    this.loadByPage(currentPage, this.size);
  }
  onSize(size: number): void {
    this.loadByPage(this.currentPage, size);
  }
}
