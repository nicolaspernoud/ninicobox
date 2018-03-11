import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDialogComponent } from './basic-dialog.component';
import { MaterialModule } from '../../material.module';
import { MatDialogRef } from '@angular/material';

describe('BasicDialogComponent', () => {
  let component: BasicDialogComponent;
  let fixture: ComponentFixture<BasicDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BasicDialogComponent
      ],
      imports: [
        MaterialModule
      ],
      providers: [{provide: MatDialogRef, useValue: {}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
