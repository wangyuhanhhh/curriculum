import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

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
  constructor(private httpClient: HttpClient,
              private router: Router) { }

  ngOnInit(): void {
  }
  onSubmit(): void {
    console.log('点击保存按钮');
    console.log(this.addSchool);
    // 向后台发起http请求
    this.httpClient.post('http://localhost:8088/api/school/add', this.addSchool)
      .subscribe((result) => this.router.navigateByUrl('/school'),
      error => console.log('保存失败', error));
  }

}
