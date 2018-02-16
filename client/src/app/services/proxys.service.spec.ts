import { TestBed, inject } from '@angular/core/testing';
import { ProxysService } from './proxys.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('ProxysService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProxysService, HttpClient, HttpHandler]
    });
  });

  it('should be created', inject([ProxysService], (service: ProxysService) => {
    expect(service).toBeTruthy();
  }));
});
