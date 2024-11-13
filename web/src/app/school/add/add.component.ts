import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {School} from '../../entity/school';
import {SchoolService} from '../../../service/school.service';
import {CommonService} from '../../../service/common.service';
import {LoginService} from '../../../service/login.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  // 新增的学校
  addSchool = {
    school: '' as string,
  } as School;

  constructor(private schoolService: SchoolService,
              private commonService: CommonService,
              private router: Router,
              private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.getCurrentUser().subscribe(user => {
      const role = user.role;
      if (role === 3) {
        this.router.navigate(['dashboard']);
      }
    }, error => this.commonService.showErrorAlert('当前登录用户数据获取失败'));
  }

  onSubmit(): void {
    // 向后台发起http请求
    this.schoolService.add(this.addSchool)
      .subscribe(data => {
          if (data.success) {
            this.commonService.showSuccessAlert(data.message);
            this.router.navigateByUrl('/school');
          } else {
            this.commonService.showErrorAlert(data.message);
          }
        },
        error => console.log('保存失败', error));
  }
}
