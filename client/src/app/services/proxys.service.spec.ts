import { TestBed, inject } from '@angular/core/testing';

import { ProxysService } from './proxys.service';

describe('ProxysService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProxysService]
    });
  });

  it('should be created', inject([ProxysService], (service: ProxysService) => {
    expect(service).toBeTruthy();
  }));
});
