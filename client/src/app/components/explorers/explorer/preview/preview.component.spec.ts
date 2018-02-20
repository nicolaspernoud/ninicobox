import { PreviewComponent } from './preview.component';
import { async, TestBed, inject } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MaterialModule } from '../../../../material.module';

describe('PreviewComponent', () => {
  let dialog: MatDialog;
  let overlayContainer: OverlayContainer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule
      ]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [PreviewComponent]
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
    const dialogRef = dialog.open(PreviewComponent, {
      data: { param: '1' }
    });

    // verify
    expect(dialogRef.componentInstance instanceof PreviewComponent).toBe(true);
  });
});
