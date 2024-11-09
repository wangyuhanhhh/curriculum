import {Component, OnDestroy, OnInit} from '@angular/core';
import {Course} from '../entity/course';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Page} from '../entity/page';
import {HttpParams} from '@angular/common/http';
import {CourseService} from '../../service/course.service';
import {Router} from '@angular/router';
import {CommonService} from '../../service/common.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, OnDestroy {
  course = [] as Course[];
  formGroup = new FormGroup({
    type: new FormControl(''),
    searchCourse: new FormControl(null),
  });
  // 默认显示第一页
  currentPage = 1;
  // 每页默认5条
  size = 5;
  pageData = new Page<Course>({
    content: [],
    number: 1,
    size: 5,
    numberOfElements: 0,
    totalPages: 0
  });
  shouldSavePage = false;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private commonService: CommonService) {
  }

  ngOnInit(): void {
    const currentPage = parseInt(localStorage.getItem('currentPage'), 10) || 1;
    this.loadByPage(currentPage, this.size);
  }

  onEdit(id: number, courseInfoId: number): void {
    this.shouldSavePage = true;
    this.router.navigate(['/course/edit', id, courseInfoId]);
  }

  // 通用分页加载方法，支持搜索和分页
  loadByPage(currentPage = 1, size = 5): void {
    // 保证用户在搜索框无内容时，点击搜索查询到的结果是所有数据
    const searchType = this.formGroup.get('type')?.value || '';
    const searchCourse = this.formGroup.get('searchCourse')?.value || '';
    const httpParams = new HttpParams()
      .append('type', searchType)
      .append('course', searchCourse)
      .append('currentPage', currentPage.toString())
      .append('size', size.toString());
    this.courseService.search(httpParams).subscribe(
      (data: Page<Course>) => {
        console.log(data);
        this.pageData = data;
        this.currentPage = currentPage;
      },
      error => console.error(error)
    );
  }

  onDelete(courseInfoId: number): void {
    this.commonService.showConfirmAlert(() => {
      this.courseService.delete(courseInfoId).subscribe(data => {
        if (data.success) {
          this.loadByPage(this.currentPage, this.size);
          this.commonService.showSuccessAlert(data.message);
        } else {
          this.commonService.showErrorAlert(data.message);
        }
      }, error => console.log(error));
    }, '是否删除，此操作不可逆');
  }

  onSearch(): void {
    this.loadByPage(1, this.size);
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

  // 如果该用户下没有激活的学期，不进行页面跳转并提示用户
  checkBeforeAdd(): void {
    this.courseService.checkTerm().subscribe( data => {
      console.log(data);
      if (data.success) {
        this.router.navigate(['/course/add']);
      } else {
        this.commonService.showErrorAlert(data.message);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.shouldSavePage) {
      localStorage.setItem('currentPage', this.currentPage.toString());
    } else {
      localStorage.removeItem('currentPage');
    }
  }
}
