import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {School} from '../../entity/school';
import Swal from 'sweetalert2';
import {SchoolService} from '../../../service/school.service';
import {CommonService} from '../../../service/common.service';

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
              private router: Router) {
  }

  ngOnInit(): void {
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
