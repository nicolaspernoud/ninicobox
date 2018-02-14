import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExplorersComponent } from './explorers.component';
import { MaterialModule } from '../../material.module';
import { ExplorerComponent } from './explorer/explorer.component';
import { FileUploadComponent } from './explorer/file-upload/file-upload.component';
import { FilesService } from '../../services/files.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

describe('ExplorersComponent', () => {
  let component: ExplorersComponent;
  let fixture: ComponentFixture<ExplorersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorersComponent, ExplorerComponent, FileUploadComponent],
      imports: [
        MaterialModule
      ],
      providers: [AuthService, FilesService, HttpClient, HttpHandler, Router]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
