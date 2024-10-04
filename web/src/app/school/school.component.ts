import { Component, OnInit } from '@angular/core';
import {School} from '../entity/school';
import {Confirm} from 'notiflix';
import {SchoolService} from '../../service/school.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {
  schools = [] as School[];
  constructor(private schoolService: SchoolService) {
  }

  ngOnInit(): void {
    this.schoolService.getAll()
      .subscribe(schoolJson => {
        this.schools = schoolJson;
      }, error => {
        console.log(error);
      });
  }
  // index 索引 schoolId 当前迭代到的学校的ID
  onDelete(index: number, schoolId: number): void {
    Confirm.show('请确认', '该操作不可逆', '确认', '取消',
      () => {
        this.schoolService.delete(schoolId)
          .subscribe(data => {
            console.log('删除成功', data);
            if (data.success) {
              this.schools.splice(index, 1);
              this.showSuccessAlert(data.message);
            } else {
              this.showErrorAlert(data.message);
            }
          },
            error => console.log('删除失败', error));
      });
  }
  // 显示成功弹窗
  private showSuccessAlert(message: string): void {
    Swal.fire({
      icon: 'success',
      title: '删除成功',
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  }
  // 显示失败弹窗
  private showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: '错误',
      text: message
    });
  }
}
