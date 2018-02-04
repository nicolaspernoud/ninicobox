import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxysComponent } from './proxys.component';

describe('ProxysComponent', () => {
  let component: ProxysComponent;
  let fixture: ComponentFixture<ProxysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProxysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProxysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
