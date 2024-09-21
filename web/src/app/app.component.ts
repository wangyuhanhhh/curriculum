import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'web';
  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    console.log('123');
    this.http.get<string>('/api/term/index').subscribe(v => {
      console.log(v);
    });
  }
}
