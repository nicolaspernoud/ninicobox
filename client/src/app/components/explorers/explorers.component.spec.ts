import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExplorersComponent } from './explorers.component';
import { MaterialModule } from '../../material.module';
import { ExplorerComponent } from './explorer/explorer.component';
import { FileUploadComponent } from './explorer/file-upload/file-upload.component';
import { FilesService } from '../../services/files.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FilesaclService } from '../../services/filesacl.service';
import { FilesAC } from '../../../../../common/interfaces';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ExplorersComponent', () => {
  let component: ExplorersComponent;
  let fixture: ComponentFixture<ExplorersComponent>;
  let filesaclService: FilesaclService;
  const testFilesACL: FilesAC[] =
  [
    {
      name: 'Users Only',
      basepath: '../data/users',
      roles: ['user'],
      permissions: 'r'
    },
    {
      name: 'Admins Only RW',
      basepath: '../data/admins',
      roles: ['admin'],
      permissions: 'rw'
    }
];

  class MockRouter {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExplorersComponent, ExplorerComponent, FileUploadComponent],
      imports: [
        MaterialModule, BrowserAnimationsModule
      ],
      providers: [FilesaclService, AuthService, FilesService, HttpClient, HttpHandler, { provide: Router, useClass: MockRouter }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorersComponent);
    component = fixture.componentInstance;
    filesaclService = TestBed.get(FilesaclService);
    spyOn(filesaclService, 'getFilesACL').and.returnValue(Observable.of(testFilesACL));
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
