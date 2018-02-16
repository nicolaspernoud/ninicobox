import { ShowToRolesDirective } from './showtoroles.directive';
import { TestBed } from '@angular/core/testing';
import { ElementRef, ViewContainerRef, TemplateRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { MaterialModule } from '../material.module';


describe('ShowToRolesDirective', () => {

  let templateRef: TemplateRef<any>;
  let authService: AuthService;
  let viewContainer: ViewContainerRef;

  class MockRouter {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule
      ],
      providers: [TemplateRef, AuthService, ViewContainerRef, HttpClient, HttpHandler, { provide: Router, useClass: MockRouter }]
    });
    templateRef = TestBed.get(TemplateRef);
    authService = TestBed.get(AuthService);
    viewContainer = TestBed.get(ViewContainerRef);
  });


  it('should create an instance', () => {
    const directive = new ShowToRolesDirective(templateRef, authService, viewContainer);
    expect(directive).toBeTruthy();
  });
});
