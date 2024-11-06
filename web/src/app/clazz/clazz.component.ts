import { Component, OnInit } from '@angular/core';
import {ClazzService} from '../../service/clazz.service';
import {CommonService} from '../../service/common.service';
import { Clazz } from '../entity/clazz';
import {Page} from '../entity/page';
import {HttpParams} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-clazz',
  templateUrl: './clazz.component.html',
  styleUrls: ['./clazz.component.css']
})
export class ClazzComponent implements OnInit {
  formGroup = new FormGroup({
    school_id: new FormControl(''),
  });
  clazzes = [] as Clazz[];
  searchClazz = '';
  // 默认显示第一页
  currentPage = 1;
  // 每页默认5条
  size = 5;
  pageData = new Page<Clazz> ({
    content: [],
    number: 1,
    size: 5,
    numberOfElements: 0,
    totalPages: 0
  });
  constructor(private clazzService: ClazzService,
              private commonService: CommonService,
              private router: Router) {
  }
  ngOnInit(): void {
    this.loadByPage();
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
  // 当分页组件页码变化时调用
  onPage(currentPage: number): void {
    this.loadByPage(currentPage, this.size);
  }

  // 当分页组件的分页大小变化时调用
  onSize(size: number): void {
    this.size = size;
    this.loadByPage(this.currentPage, size);
  }

  onSearch(): void {
    this.loadByPage(1, this.size);
  }

  // 如果该班级对应的学校没有教师，不进行页面跳转并提示用户
  checkBeforeSetHeadTeacher(id: number): void {
    this.clazzService.checkTeacher(id).subscribe(data => {
      if (data.success) {
        this.router.navigate(['/clazz/setHeadTeacher', id]);
      } else {
        this.commonService.showErrorAlert(data.message);
      }
    }, error => console.log(error));
  }
}
