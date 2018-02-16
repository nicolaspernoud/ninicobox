import { TestBed, inject } from '@angular/core/testing';
import { FilesaclService } from './filesacl.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('FilesaclService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilesaclService, HttpClient, HttpHandler]
    });
  });

  it('should be created', inject([FilesaclService], (service: FilesaclService) => {
    expect(service).toBeTruthy();
  }));
});
