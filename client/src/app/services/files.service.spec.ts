import { TestBed, inject } from '@angular/core/testing';
import { FilesService } from './files.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('FilesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilesService, HttpClient, HttpHandler]
    });
  });

  it('should be created', inject([FilesService], (service: FilesService) => {
    expect(service).toBeTruthy();
  }));
});
