import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {School} from '../entity/school';
import {Confirm, Report} from 'notiflix';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {
  schools = [] as School[];
  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.httpClient.get<School[]>('http://localhost:8088/api/school/index')
      .subscribe(schoolJson => {
        this.schools = schoolJson;
      }, error => {
        console.log(error);
      });
  }
  // index 索引 schoolId 当前迭代到的学校的ID
  onDelete(index: number, schoolId: number): void {
    Confirm.show('请确认', '该操作不可逆', '确认', '取消',
      () => {
        this.httpClient.delete(`/api/school/delete/${schoolId}`)
          .subscribe(() => {
            console.log('删除成功');
            this.schools.splice(index, 1);
            },
            error => console.log('删除失败', error));
      });
  }
}
