import { Component, OnInit } from '@angular/core';
import { TermService } from '../../service/term.service';
import { ActivatedRoute } from '@angular/router';
import {CommonService} from '../../service/common.service';
import {School} from '../entity/school';
import { SchoolService } from '../../service/school.service';
import {HttpParams} from '@angular/common/http';
import {Page} from '../entity/page';
import {Clazz} from '../entity/clazz';
import {Term} from '../entity/term';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {
  // 用于存储从后端获取的数据
  terms: any[] = [];
  id: number;
  schools = new Array<School>();
  // 默认显示第一页
  currentPage = 1;
  // 每页默认10条
  size = 5;
  pageData = new Page<Term> ({
    content: [],
    number: 1,
    size: 5,
    numberOfElements: 0,
    totalPages: 0
  });
  constructor(private termService: TermService,
              private schoolService: SchoolService,
              private activeRoute: ActivatedRoute,
              private commonService: CommonService) {
  }
  ngOnInit(): void {
   this.loadByPage();
  }
  loadByPage(currentPage = 1, size = 5): void {
    // 后台请求
    const httpParams = new HttpParams().append('currentPage', currentPage.toString())
      .append('size', size.toString());
    this.termService.loadByPage(httpParams).subscribe(data => {
      this.pageData = data;
      this.currentPage = currentPage;
    }, error => console.log(error));
  }
  getAll(): void {
    this.termService.getAll().subscribe(terms => {
      this.terms = terms;
    });
  }

  onActive(id: number): void {
    this.commonService.showConfirmAlert(() => {
      this.termService.active(id).subscribe((responseBody) => {
        if (responseBody.success) {
          this.commonService.showSuccessAlert(responseBody.message);
          this.getAll();
        } else {
          this.commonService.showErrorAlert(responseBody.message);
        }
      });
    }, '是否激活, 此操作不可逆');
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
