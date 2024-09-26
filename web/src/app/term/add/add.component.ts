import { Component, OnInit } from '@angular/core';
import { TermService } from '../../../service/term.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  term = {} as {
    term: string,
    start_time: Date,
    end_time: Date,
    status: number;
  };

  constructor(private termService: TermService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const term = {term: this.term.term, start_time: this.term.start_time.getTime(), end_time: this.term.end_time.getTime(), status: this.term.status};
    this.termService.addTerm(term).subscribe(
      response => {
        console.log(response.success);
        // 根据服务器返回的响应来显示成功或失败的弹窗
        if (response.success) {
          this.showSuccessAlert(response.message);
        } else {
          this.showErrorAlert(response.message);
        }
      },
      error => {
        // 处理HTTP错误
        this.showErrorAlert('请求失败，请稍后再试');
      }
    );
  }

  // 显示成功弹窗
  private showSuccessAlert(message: string) {
    Swal.fire({
      icon: 'success',
      title: '成功',
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  // 显示失败弹窗
  private showErrorAlert(message: string) {
    Swal.fire({
      icon: 'error',
      title: '错误',
      text: message
    });
  }
}
