import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {School} from '../../entity/school';
import {SchoolService} from '../../../service/school.service';
import {CommonService} from '../../../service/common.service';
import {LoginService} from '../../../service/login.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  editSchool = {
    id: 0,
    school: ''
  } as School;

  constructor(private activeRoute: ActivatedRoute,
              private schoolService: SchoolService,
              private commonService: CommonService,
              private router: Router,
              private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.loginService.getCurrentUser().subscribe(user => {
      const role = user.role;
      if (role === 3) {
        this.router.navigate(['dashboard']);
      }
    }, error => this.commonService.showErrorAlert('当前登录用户数据获取失败'));
    const id = this.activeRoute.snapshot.params.id;
    this.schoolService.getSchoolById(id)
      .subscribe(data => {
        this.editSchool = data;
      }, error => {
        console.log('获取编辑数据失败', error);
      });
  }

  onSubmit(): void {
    console.log(this.editSchool);
    const id = this.activeRoute.snapshot.params.id;
    this.schoolService.update(id, this.editSchool)
      .subscribe(data => {
        console.log('更新成功', data);
        if (data.success) {
          this.commonService.showSuccessAlert(data.message);
          this.router.navigateByUrl('/school');
        } else {
          this.commonService.showErrorAlert(data.message);
        }
      }, error => {
        console.log('更新失败', error);
      });
  }
}
