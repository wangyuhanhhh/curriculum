import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {
  // 用于存储从后端获取的数据
  terms: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<string>('/api/term/index').subscribe(v => {
      console.log(v);
    });
  }

}
