import { AddProxyDialogComponent } from './add-proxy-dialog.component';
import { async, TestBed, inject } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MaterialModule } from '../../../material.module';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AddProxyDialogComponent', () => {
  let dialog: MatDialog;
  let overlayContainer: OverlayContainer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddProxyDialogComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [HttpClient, HttpHandler]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [AddProxyDialogComponent]
      }
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject([MatDialog, OverlayContainer],
    (d: MatDialog, oc: OverlayContainer) => {
      dialog = d;
      overlayContainer = oc;
    })
  );

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should open a dialog with a component', () => {
    const dialogRef = dialog.open(AddProxyDialogComponent, {
      data: { param: '1' }
    });

    // verify
    expect(dialogRef.componentInstance instanceof AddProxyDialogComponent).toBe(true);
  });
});
