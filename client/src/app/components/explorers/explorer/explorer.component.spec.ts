import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExplorerComponent } from './explorer.component';
import { MaterialModule } from '../../../material.module';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FilesService } from '../../../services/files.service';
import { File } from '../../../../../../common/interfaces';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('ExplorerComponent', () => {
  let component: ExplorerComponent;
  let fixture: ComponentFixture<ExplorerComponent>;
  let filesService: FilesService;
  const testFiles = [
    { name: 'testFile', path: './testFile', isDir: false },
    { name: 'testDir', path: './testDir', isDir: true }
  ] as File[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExplorerComponent, FileUploadComponent],
      imports: [
        MaterialModule,
      ],
      providers: [FilesService, HttpClient, HttpHandler]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerComponent);
    component = fixture.componentInstance;
    filesService = TestBed.get(FilesService);
    spyOn(filesService, 'explore').and.returnValue(Observable.of(testFiles));
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
