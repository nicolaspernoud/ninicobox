// Angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// Material module
import { MaterialModule } from './material.module';
// Technical modules
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { TokenInterceptor } from './services/token.interceptor';
import { ErrorInterceptor } from './services/errors.interceptor';
import { RouteGuard } from './services/route.guard';
import { FocusDirective } from './directives/focus.directive';
import { ShowToRolesDirective } from './directives/showtoroles.directive';
// Business modules
import { LoginComponent } from './components/login/login.component';
import { ExplorersComponent } from './components/explorers/explorers.component';
import { FileUploadComponent } from './components/explorers/explorer/file-upload/file-upload.component';
import { AuthService } from './services/auth.service';
import { ExplorerComponent, CutCopyProgressBarComponent } from './components/explorers/explorer/explorer.component';
import { ProxysService } from './services/proxys.service';
import { ProxysComponent } from './components/proxys/proxys.component';
import { UsersComponent } from './components/users/users.component';
import { UsersService } from './services/users.service';
import { AddProxyDialogComponent } from './components/proxys/add-proxy-dialog/add-proxy-dialog.component';
import { RenameDialogComponent } from './components/explorers/explorer/rename-dialog/rename-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FocusDirective,
    ShowToRolesDirective,
    FileUploadComponent,
    ExplorersComponent,
    ExplorerComponent,
    CutCopyProgressBarComponent,
    ProxysComponent,
    AddProxyDialogComponent,
    UsersComponent,
    RenameDialogComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MaterialModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    AuthService,
    RouteGuard,
    ProxysService,
    UsersService
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddProxyDialogComponent, RenameDialogComponent, CutCopyProgressBarComponent]
})
export class AppModule { }
