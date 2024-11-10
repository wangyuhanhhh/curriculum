import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../service/user.service';
import {User} from '../entity/user';
import {Clazz} from '../entity/clazz';
import {CommonService} from '../../service/common.service';
import {HttpParams} from '@angular/common/http';
import {Page} from '../entity/page';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  searchName = '';
  searchStudentNo = '';
  users: User[] = [];
  clazzes: Clazz[] = [];
  // 默认显示第一页
  currentPage = 1;
  // 每页默认10条
  size = 5;
  pageData = new Page<User> ({
    content: [],
    number: 1,
    size: 5,
    numberOfElements: 0,
    totalPages: 0
  });
  shouldSavePage = false;

  constructor(private userService: UserService,
              private commonService: CommonService,
              private router: Router) { }

  ngOnInit(): void {
    this.getAll();
    const currentPage = parseInt(localStorage.getItem('currentPage'), 10) || 1;
    this.loadByPage(currentPage, this.size);
  }

  loadByPage(currentPage = 1, size = 5): void {
    // 后台请求
    const httpParams = new HttpParams()
      .append('name', this.searchName)
      .append('student_no', this.searchStudentNo)
      .append('currentPage', currentPage.toString())
      .append('size', size.toString());

    this.userService.search(httpParams).subscribe(data => {
      this.pageData = data;
      this.currentPage = currentPage;
    }, error => console.log(error));
  }

  getAll(): void {
    this.userService.getAll().subscribe(
      users => this.users = users
    );
  }

  onDelete(id: number): void {
    this.commonService.showConfirmAlert(() => {
      this.userService.delete(id)
        .subscribe((responseBody) => {
          if (responseBody.success) {
            this.commonService.showSuccessAlert(responseBody.message);
            this.loadByPage(this.currentPage, this.size);
          } else {
            this.commonService.showErrorAlert(responseBody.message);
          }
        }, error => this.commonService.showErrorAlert('请求错误，请稍后'));
    }, '是否删除，此操作不可逆');
  }

  onActive(id: number): void {
    console.log('点击冻结按钮');
    this.commonService.showConfirmAlert(() => {
      this.userService.freeze(id).subscribe((responseBody) => {
        if (responseBody.success) {
          this.commonService.showSuccessAlert(responseBody.message);
          this.shouldSavePage = true;
          this.loadByPage(this.currentPage, this.size);
        } else {
          this.commonService.showErrorAlert(responseBody.message);
        }
      });
    }, '是否冻结, 此操作不可逆');
  }

  onEdit(id: number): void {
    this.shouldSavePage = true;
    console.log(this.currentPage.toString());
    this.router.navigate(['/user/edit', id]);
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
