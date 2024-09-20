import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {
  // 定义学期数组
  terms = [{
    id: 1,
    term: '2023-2024学年第一学期',
    start_time: '2023-9-1',
    end_time: '2024-1-13',
    status: 1
  }, {
    id: 2,
    term: '2023-2024学年第二学期',
    start_time: '2024-2-28',
    end_time: '2024-6-10',
    status: 0
  }];

  constructor() { }

  ngOnInit(): void {
  }

}
