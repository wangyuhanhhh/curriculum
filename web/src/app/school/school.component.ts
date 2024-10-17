import { Component, OnInit } from '@angular/core';
import {School} from '../entity/school';
import {SchoolService} from '../../service/school.service';
import {CommonService} from '../../service/common.service';
import {HttpParams} from '@angular/common/http';
import {Page} from '../entity/page';
import {Clazz} from '../entity/clazz';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {
  schools = [] as School[];
  constructor(private schoolService: SchoolService,
              private commonService: CommonService) {
  }
  // 默认显示第一页
  currentPage = 1;
  // 每页默认5条
  size = 5;
  pageData = new Page<School> ({
    content: [],
    number: 1,
    size: 5,
    numberOfElements: 0,
    totalPages: 0
  });
  ngOnInit(): void {
    this.loadByPage();
  }
  loadByPage(currentPage = 1, size = 5): void {
    // 后台请求
    const httpParams = new HttpParams().append('currentPage', currentPage.toString())
      .append('size', size.toString());
    this.schoolService.loadByPage(httpParams).subscribe(data => {
      this.pageData = data;
      this.currentPage = currentPage;
    }, error => console.log(error));
  }
  // index 索引 schoolId 当前迭代到的学校的ID
  onDelete(index: number, schoolId: number): void {
    this.commonService.showConfirmAlert(() => {
      this.schoolService.delete(schoolId)
        .subscribe(data => {
          if (data.success) {
            this.schools.splice(index, 1);
            this.commonService.showSuccessAlert(data.message);
          } else {
            this.commonService.showErrorAlert(data.message);
          }
        }, error => console.log('删除失败', error));
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
