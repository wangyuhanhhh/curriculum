import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  // 新增的学校
  addSchool = {
    school: ''
  };
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }
  onSubmit(): void {
    console.log('点击保存按钮');
    console.log(this.addSchool);
    // 向后台发起http请求
    this.httpClient.post('http://localhost:8088/api/school/add', this.addSchool, {
      headers: {'Content-Type': 'application/json'}
    })
      .subscribe((result) => {
        console.log('接收到返回数据', result);
      }, error => {
        console.log('失败', error);
      });
  }

}
