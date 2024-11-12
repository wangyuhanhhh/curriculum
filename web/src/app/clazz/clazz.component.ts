import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClazzService} from '../../service/clazz.service';
import {CommonService} from '../../service/common.service';
import {Clazz} from '../entity/clazz';
import {Page} from '../entity/page';
import {HttpParams} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginService} from '../../service/login.service';

@Component({
  selector: 'app-clazz',
  templateUrl: './clazz.component.html',
  styleUrls: ['./clazz.component.css']
})
export class ClazzComponent implements OnInit, OnDestroy {
  formGroup = new FormGroup({
    school_id: new FormControl(''),
  });
  clazzes = [] as Clazz[];
  searchClazz = '';
  // 默认显示第一页
  currentPage = 1;
  // 每页默认5条
  size = 5;

  pageData = new Page<Clazz>({
    content: [],
    number: 1,
    size: 5,
    numberOfElements: 0,
    totalPages: 0
  });
  shouldSavePage = false;

  constructor(private clazzService: ClazzService,
              private commonService: CommonService,
              private router: Router,
              private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.loginService.getCurrentUser().subscribe(data => {
      // @ts-ignore
      const user = JSON.parse(data);
      const role = user.role;
      console.log(role);
      if (role !== 0 && role !== 1) {
        this.router.navigate(['dashboard']);
      }
    }, error => this.commonService.showErrorAlert('当前登录用户数据获取失败'));
    const currentPage = parseInt(localStorage.getItem('currentPage'), 10) || 1;
    this.loadByPage(currentPage, this.size);
  }

  // 通用分页加载方法，支持搜索和分页
  loadByPage(currentPage = 1, size = 5): void {
    // 保证用户在搜索框无内容时，点击搜索查询到的结果是所有数据
    const searchSchoolId = this.formGroup.get('school_id')?.value || '';
    const httpParams = new HttpParams()
      .append('clazz', this.searchClazz)
      .append('school_id', searchSchoolId)
      .append('currentPage', currentPage.toString())
      .append('size', size.toString());

    this.clazzService.search(httpParams).subscribe(
      (data: Page<Clazz>) => {
        this.pageData = data;
        this.currentPage = currentPage;
      },
      error => console.error(error)
    );
  }

  onDelete(id: number): void {
    this.commonService.showConfirmAlert(() => {
      this.clazzService.delete(id).subscribe(data => {
          if (data.success) {
            this.loadByPage(this.currentPage, this.size);
            this.commonService.showSuccessAlert(data.message);
          } else {
            this.commonService.showErrorAlert(data.message);
          }
        }, error => this.commonService.showErrorAlert(error.message)
      );
    }, '是否删除，此操作不可逆');
  }

  onEdit(id: number): void {
    this.shouldSavePage = true;
    this.router.navigate(['/clazz/edit', id]);
  }

  /**
   * loadByPage方法接受两个参数，这里调用loadByPage方法也应该传递两个参数
   * 当分页组件页码变化时调用
   * 从page组件接收到页码发生变化的时候调用，根据新的页码重新加载数据
   */
  onPage(currentPage: number): void {
    this.loadByPage(currentPage, this.size);
  }

  /**
   * 当分页组件的分页大小变化时调用
   * @param size 页面大小
   */
  onSize(size: number): void {
    this.loadByPage(this.currentPage, size);
  }

  onSearch(): void {
    this.loadByPage(1, this.size);
  }

  // 如果该班级对应的学校没有教师，不进行页面跳转并提示用户
  checkBeforeSetHeadTeacher(id: number): void {
    this.clazzService.checkTeacher(id).subscribe(data => {
      if (data.success) {
        this.shouldSavePage = true;
        this.router.navigate(['/clazz/setHeadTeacher', id]);
      } else {
        this.commonService.showErrorAlert(data.message);
      }
    }, error => console.log(error));
  }

  ngOnDestroy(): void {
    if (this.shouldSavePage) {
      localStorage.setItem('currentPage', this.currentPage.toString());
    } else {
      localStorage.removeItem('currentPage');
    }
  }
}
