import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../../../../common/interfaces';
import { $ } from 'protractor';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  private users: User[];

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.usersService.getUsers().subscribe(data => this.users = data );
  }

  addUser() {
    const newUser: User = {
      id: Math.max(...this.users.map(value => value.id)) + 1,
      login: 'newLogin',
      password: 'newPassword',
      role: 'user',
    };
    this.users.push(newUser);
  }

  delete(user: User) {
    this.users.splice(this.users.findIndex(value => value.id === user.id), 1);
  }

  save() {
    this.usersService.setUsers(this.users).toPromise().then(value => { this.usersService.getUsers().subscribe(data => this.users); });
  }

}