import { Component, OnInit } from '@angular/core';
import {ClazzService} from '../../service/clazz.service';
import {CommonService} from '../../service/common.service';
import { Clazz } from '../entity/clazz';

@Component({
  selector: 'app-clazz',
  templateUrl: './clazz.component.html',
  styleUrls: ['./clazz.component.css']
})
export class ClazzComponent implements OnInit {
  clazzes = [] as Clazz[];
  constructor(private clazzService: ClazzService,
              private commonService: CommonService) {
  }
  ngOnInit(): void {
    this.clazzService.getAll()
      .subscribe(clazzJson => {
        this.clazzes = clazzJson;
      }, error => {
        console.log(error);
      }
    );
  }
  onDelete(index: number, id: number): void {
    this.commonService.showConfirmAlert(() => {
      this.clazzService.delete(id).subscribe(data => {
        if (data.success) {
          this.clazzes.splice(index, 1);
          this.commonService.showSuccessAlert(data.message);
        } else {
          this.commonService.showErrorAlert(data.message);
        }
      }, error => console.log(error));
    }, '是否删除，此操作不可逆');
  }
}
