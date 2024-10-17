import { Component, OnInit } from '@angular/core';
import {UserService} from '../../service/user.service';
import {User} from '../entity/user';
import {ClazzService} from '../../service/clazz.service';
import {Clazz} from '../entity/clazz';
import {CommonService} from '../../service/common.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  clazzes: Clazz[] = [];

  constructor(private userService: UserService,
              private clazzService: ClazzService,
              private commonService: CommonService) { }

  ngOnInit(): void {
    this.getAll();
    // 获取所有班级
    this.clazzService.getAll().subscribe(clazzes => {
      this.clazzes = clazzes;
    });
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

  onDelete(id: number): void {
    this.commonService.showConfirmAlert(() => {
      this.userService.delete(id)
        .subscribe((responseBody) => {
          if (responseBody.success) {
            this.commonService.showSuccessAlert(responseBody.message);
            this.getAll();
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
}
