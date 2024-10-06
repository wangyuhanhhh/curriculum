import { Component, OnInit } from '@angular/core';
import { TermService } from '../../service/term.service';
import { ActivatedRoute } from '@angular/router';
import {CommonService} from '../../service/common.service';
import {School} from '../entity/school';
import { SchoolService } from '../../service/school.service';

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

  constructor(private termService: TermService,
              private schoolService: SchoolService,
              private activeRoute: ActivatedRoute,
              private commonService: CommonService) {
  }

  ngOnInit(): void {
    this.getAll();
    // 获取学校
    this.schoolService.getAll()
      .subscribe(schoolJson => {
        this.schools = schoolJson;
        console.log(this.schools);
      }, error => {
        console.log(error);
      });
  }

  getAll(): void {
    this.termService.getAll().subscribe(terms => {
      this.terms = terms;
    });
  }

  // 根据school_id找到对应学校名称
  getSchoolName(schoolId: number): string {
    const school = this.schools.find(s => s.id === schoolId);
    return school ? school.school : '-';
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
}
