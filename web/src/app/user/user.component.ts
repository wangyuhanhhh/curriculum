import { Component, OnInit } from '@angular/core';
import {UserService} from '../../service/user.service';
import {User} from '../entity/user';
import {ClazzService} from '../../service/clazz.service';
import {Clazz} from '../entity/clazz';
import {CommonService} from '../../service/common.service';
import {HttpParams} from '@angular/common/http';
import {Page} from '../entity/page';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
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
  constructor(private userService: UserService,
              private clazzService: ClazzService,
              private commonService: CommonService) { }

  ngOnInit(): void {
    this.getAll();
    this.loadByPage();
  }
  loadByPage(currentPage = 1, size = 5): void {
    // 后台请求
    const httpParams = new HttpParams().append('currentPage', currentPage.toString())
      .append('size', size.toString());
    this.userService.loadByPage(httpParams).subscribe(data => {
      this.pageData = data;
      this.currentPage = currentPage;
    }, error => console.log(error));
  }
  getAll(): void {
    this.userService.getAll().subscribe(
      users => this.users = users
    );
  }

  // 根据clazz_id找到对应班级名称
  getClazzName(clazzId: number): string {
    const clazz = this.clazzes.find(c => c.id === clazzId);
    return clazz ? clazz.clazz : '-';
  }

  onDelete(index: number, id: number): void {
    this.commonService.showConfirmAlert(() => {
      this.userService.delete(id)
        .subscribe((responseBody) => {
          if (responseBody.success) {
            this.users.splice(index, 1);
            this.commonService.showSuccessAlert(responseBody.message);
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
          this.getAll();
        } else {
          this.commonService.showErrorAlert(responseBody.message);
        }
      });
    }, '是否冻结, 此操作不可逆');
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
