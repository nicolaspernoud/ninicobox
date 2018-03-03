import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProxysComponent } from './proxys.component';
import { MaterialModule } from '../../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProxysService } from '../../services/proxys.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('ProxysComponent', () => {
  let component: ProxysComponent;
  let fixture: ComponentFixture<ProxysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProxysComponent ],
      imports: [
        MaterialModule, BrowserAnimationsModule
      ],
      providers: [ProxysService, HttpClient, HttpHandler]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProxysComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
