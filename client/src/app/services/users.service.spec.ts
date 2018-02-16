import { TestBed, inject } from '@angular/core/testing';
import { UsersService } from './users.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('UsersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersService, HttpClient, HttpHandler]
    });
  });

  it('should be created', inject([UsersService], (service: UsersService) => {
    expect(service).toBeTruthy();
  }));
});
