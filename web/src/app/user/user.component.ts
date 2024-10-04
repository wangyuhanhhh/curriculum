import { Component, OnInit } from '@angular/core';
import {UserService} from '../../service/user.service';
import {User} from '../entity/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(
      users => this.users = users
    );
  }

}
