import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {
  // 学校
  schools = [{
    id: 1,
    学校: '天津职业技术师范大学'
  }, {
    id: 2,
    学校: '河北工业大学'
  }];

  constructor() { }

  ngOnInit(): void {
  }
  onDelete(id: number): void {
  }

}
