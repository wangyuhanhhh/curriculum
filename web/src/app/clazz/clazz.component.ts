import { Component, OnInit } from '@angular/core';
import {ClazzService} from '../../service/clazz.service';
import {Clazz} from '../entity/clazz';
import {SchoolService} from '../../service/school.service';
import {School} from '../entity/school';

@Component({
  selector: 'app-clazz',
  templateUrl: './clazz.component.html',
  styleUrls: ['./clazz.component.css']
})
export class ClazzComponent implements OnInit {
  clazzes = [] as Clazz[];
  schools = [] as School[];
  constructor(private clazzService: ClazzService,
              private schoolService: SchoolService) {
  }
  ngOnInit(): void {
    this.clazzService.getAll()
      .subscribe(clazzJson => {
        this.clazzes = clazzJson;
      }, error => {
        console.log(error);
      }
    );
  }
  onDelete(index: number, id: number): void {}
  // 根据school_id找到对应的学校名称
  getSchoolName(schoolId: number): string {
    // 获取所有的学校
    this.schoolService.getAll().subscribe(data => {
      this.schools = data;
    }, error => console.log(error));
    const school = this.schools.find(s => s.id === schoolId);
    return school ? school.school : '-';
  }
}
