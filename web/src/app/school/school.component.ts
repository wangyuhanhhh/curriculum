import { Component, OnInit } from '@angular/core';
import {School} from '../entity/school';
import {SchoolService} from '../../service/school.service';
import {CommonService} from '../../service/common.service';

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

  ngOnInit(): void {
    this.schoolService.getAll()
      .subscribe(schoolJson => {
        this.schools = schoolJson;
      }, error => {
        console.log(error);
      });
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
}
