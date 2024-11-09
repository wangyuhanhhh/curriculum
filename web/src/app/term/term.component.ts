import {Component, OnDestroy, OnInit} from '@angular/core';
import {TermService} from '../../service/term.service';
import {Router} from '@angular/router';
import {CommonService} from '../../service/common.service';
import {School} from '../entity/school';
import {HttpParams} from '@angular/common/http';
import {Page} from '../entity/page';
import {Term} from '../entity/term';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit, OnDestroy {
  formGroup = new FormGroup({
    school_id: new FormControl(''),
  });
  searchTerm = '';
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
  shouldSavePage = false;

  constructor(private termService: TermService,
              private commonService: CommonService,
              private router: Router) {
  }

  ngOnInit(): void {
    const currentPage = parseInt(localStorage.getItem('currentPage'), 10) || 1;
    this.loadByPage(currentPage, this.size);
  }

  loadByPage(currentPage = 1, size = 5): void {
    const searchSchoolId = this.formGroup.get('school_id')?.value || '';
    const httpParams = new HttpParams()
      .append('school_id', searchSchoolId)
      .append('term', this.searchTerm)
      .append('currentPage', currentPage.toString())
      .append('size', size.toString());

    this.termService.search(httpParams).subscribe(data => {
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
          this.loadByPage(this.currentPage, this.size);
        } else {
          this.commonService.showErrorAlert(responseBody.message);
        }
      });
    }, '是否激活, 此操作不可逆');
  }

  onEdit(id: number): void {
    this.shouldSavePage = true;
    console.log(this.currentPage.toString());
    this.router.navigate(['/term/edit', id]);
  }

  /**
   * loadByPage方法接受两个参数，这里调用loadByPage方法也应该传递两个参数
   */
  onPage(currentPage: number): void {
    this.loadByPage(currentPage, this.size);
  }

  onSize(size: number): void {
    this.size = size;
    this.loadByPage(this.currentPage, size);
  }

  onSearch(): void {
    this.loadByPage(1, this.size);
  }

  ngOnDestroy(): void {
    if (this.shouldSavePage) {
      localStorage.setItem('currentPage', this.currentPage.toString());
    } else {
      localStorage.removeItem('currentPage');
    }
  }
}
