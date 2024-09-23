import { Component, OnInit } from '@angular/core';
import { TermService } from '../../service/term.service';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {
  // 用于存储从后端获取的数据
  terms: any[] = [];

  constructor(private termService: TermService) {
    console.log('term组件成功注入termService', termService);
  }

  ngOnInit(): void {
    this.termService.getAllTerms().subscribe(terms => {
      this.terms = terms;
    });
  }

}
