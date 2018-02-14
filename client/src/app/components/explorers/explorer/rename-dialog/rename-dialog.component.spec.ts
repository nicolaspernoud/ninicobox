import { RenameDialogComponent } from './rename-dialog.component';
import { async, TestBed, inject } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MaterialModule } from '../../../../material.module';

describe('RenameDialogComponent', () => {
  let dialog: MatDialog;
  let overlayContainer: OverlayContainer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RenameDialogComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule
      ]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [RenameDialogComponent]
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
    const dialogRef = dialog.open(RenameDialogComponent, {
      data: { param: '1' }
    });

    // verify
    expect(dialogRef.componentInstance instanceof RenameDialogComponent).toBe(true);
  });
});
