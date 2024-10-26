import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../service/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private loginService: LoginService,
              private router: Router) { }

  ngOnInit(): void {
    this.loginService.currentLoginUser().subscribe(() => {
    });
    this.loginService.getCurrentUser().subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }
}
