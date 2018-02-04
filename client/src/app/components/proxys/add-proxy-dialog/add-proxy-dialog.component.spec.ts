import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProxyDialogComponent } from './add-proxy-dialog.component';

describe('AddProxyDialogComponent', () => {
  let component: AddProxyDialogComponent;
  let fixture: ComponentFixture<AddProxyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProxyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProxyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
