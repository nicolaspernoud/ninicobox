import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { MaterialModule } from '../../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { User } from '../../../../../common/interfaces';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let usersService: UsersService;
  const testUsers: User[] = [
    {
      id: 1,
      login: 'admin',
      name: 'Ad',
      surname: 'MIN',
      password: 'password',
      role: 'admin'
    },
    {
      id: 2,
      login: 'user',
      name: 'Us',
      surname: 'ER',
      password: 'password',
      role: 'user'
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersComponent ],
      imports: [
        MaterialModule, FormsModule, BrowserAnimationsModule
      ],
      providers: [UsersService, HttpClient, HttpHandler]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    usersService = TestBed.get(UsersService);
    spyOn(usersService, 'getUsers').and.returnValue(Observable.of(testUsers));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
