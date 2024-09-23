import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {School} from '../entity/school';

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
        console.log(this.schools);
      }, error => {
        console.log(error);
      });
    console.log(1);
  }
  onDelete(id: number): void {
  }

}
