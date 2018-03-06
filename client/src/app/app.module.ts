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
import { ShowToRolesDirective } from './directives/showtoroles.directive';
import { AuthService } from './services/auth.service';
import { UpdateService } from './services/update.service';
// Business modules
import { LoginComponent } from './components/login/login.component';
import { ExplorersComponent } from './components/explorers/explorers.component';
import { FileUploadComponent } from './components/explorers/explorer/file-upload/file-upload.component';
import { ExplorerComponent, CutCopyProgressBarComponent } from './components/explorers/explorer/explorer.component';
import { ProxysService } from './services/proxys.service';
import { ProxysComponent } from './components/proxys/proxys.component';
import { UsersComponent } from './components/users/users.component';
import { UsersService } from './services/users.service';
import { AddProxyDialogComponent } from './components/proxys/add-proxy-dialog/add-proxy-dialog.component';
import { RenameDialogComponent } from './components/explorers/explorer/rename-dialog/rename-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { OpenComponent } from './components/explorers/explorer/open/open.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ShowToRolesDirective,
    FileUploadComponent,
    ExplorersComponent,
    ExplorerComponent,
    CutCopyProgressBarComponent,
    ProxysComponent,
    AddProxyDialogComponent,
    UsersComponent,
    RenameDialogComponent,
    ConfirmDialogComponent,
    OpenComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MaterialModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production})
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
    UpdateService,
    RouteGuard,
    ProxysService,
    UsersService
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddProxyDialogComponent, RenameDialogComponent, CutCopyProgressBarComponent, ConfirmDialogComponent, OpenComponent]
})
export class AppModule { }
