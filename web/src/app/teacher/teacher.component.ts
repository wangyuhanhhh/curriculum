import {Component, OnDestroy, OnInit} from '@angular/core';
import {Teacher} from '../entity/teacher';
import {TeacherService} from '../../service/teacher.service';
import {HttpParams} from '@angular/common/http';
import {Page} from '../entity/page';
import {CommonService} from '../../service/common.service';
import {Router} from '@angular/router';
import {LoginService} from '../../service/login.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit, OnDestroy {
  searchName = '';
  searchTeacherNo = '';
  // 默认显示第一页
  currentPage = 1;
  // 每页默认10条
  size = 5;
  pageData = new Page<Teacher> ({
    content: [],
    number: 1,
    size: 5,
    numberOfElements: 0,
    totalPages: 0
  });
  shouldSavePage = false;
  private roleMap: Map<number, string> = new Map([
    [0, '超级管理员'],
    [1, '管理员'],
    [2, '教师'],
    [4, '班主任']
  ]);

  constructor(private teacherService: TeacherService,
              private commonService: CommonService,
              private router: Router,
              private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.loginService.getCurrentUser().subscribe(user => {
      const role = user.role;
      if (role !== 0 && role !== 1) {
        this.router.navigate(['dashboard']);
      }
    }, error => this.commonService.showErrorAlert('当前登录用户数据获取失败'));
    const currentPage = parseInt(localStorage.getItem('currentPage'), 10) || 1;
    this.loadByPage(currentPage, this.size);
  }

  onDelete(teacherId: number): void {
    this.commonService.showConfirmAlert(() => {
      this.teacherService.delete(teacherId)
        .subscribe((responseBody) => {
          if (responseBody.success) {
            this.loadByPage(this.currentPage, this.size);
            this.commonService.showSuccessAlert(responseBody.message);
          } else {
            this.commonService.showErrorAlert(responseBody.message);
          }
        }, error => this.commonService.showErrorAlert('请求失败，请稍后'));
    }, '是否删除，此操作不可逆');
  }

  onEdit(id: number): void {
    this.shouldSavePage = true;
    console.log(this.currentPage.toString());
    this.router.navigate(['/teacher/edit', id]);
  }

  // 通用分页加载方法，支持搜索和分页
  loadByPage(currentPage = 1, size = 5): void {
    const httpParams = new HttpParams()
      .append('name', this.searchName)
      .append('teacher_no', this.searchTeacherNo)
      .append('currentPage', currentPage.toString())
      .append('size', size.toString());

    this.teacherService.search(httpParams).subscribe(
      (data: Page<Teacher>) => {
        this.pageData = data;
        this.currentPage = currentPage;
      },
      error => console.error(error)
    );
  }

  // 当分页组件页码变化时调用
  onPage(currentPage: number): void {
    this.loadByPage(currentPage, this.size);
  }

  // 当分页组件的分页大小变化时调用
  onSize(size: number): void {
    this.size = size;
    this.loadByPage(this.currentPage, size);
  }

  // 触发搜索
  onSearch(): void {
    this.loadByPage(1, this.size); // 重新从第一页开始搜索
  }

  getRoleName(role: number): string {
    return this.roleMap.get(role) || '未知角色';
  }

  ngOnDestroy(): void {
    if (this.shouldSavePage) {
      localStorage.setItem('currentPage', this.currentPage.toString());
    } else {
      localStorage.removeItem('currentPage');
    }
  }
}
