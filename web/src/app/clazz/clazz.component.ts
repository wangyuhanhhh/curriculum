import { Component, OnInit } from '@angular/core';
import {ClazzService} from '../../service/clazz.service';
import {Clazz} from '../entity/clazz';

@Component({
  selector: 'app-clazz',
  templateUrl: './clazz.component.html',
  styleUrls: ['./clazz.component.css']
})
export class ClazzComponent implements OnInit {
  clazzes = [] as Clazz[];

  constructor(private clazzService: ClazzService) {
  }

  ngOnInit(): void {
    this.clazzService.getAll()
      .subscribe(clazzJson => {
        this.clazzes = clazzJson;
        console.log('成功', clazzJson);
      }, error => {
        console.log(error);
      }
    );
  }
  onDelete(index: number, id: number): void {}
}
