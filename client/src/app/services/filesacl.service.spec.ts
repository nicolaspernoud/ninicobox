import { TestBed, inject } from '@angular/core/testing';

import { FilesaclService } from './filesacl.service';

describe('FilesaclService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilesaclService]
    });
  });

  it('should be created', inject([FilesaclService], (service: FilesaclService) => {
    expect(service).toBeTruthy();
  }));
});
