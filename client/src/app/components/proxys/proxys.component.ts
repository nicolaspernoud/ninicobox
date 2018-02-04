import { Component, OnInit } from '@angular/core';
import { ProxysService } from '../../services/proxys.service';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { Proxy } from '../../../../../common/interfaces';
import { MatDialog } from '@angular/material';
import { AddProxyDialogComponent } from './add-proxy-dialog/add-proxy-dialog.component';

@Component({
  selector: 'app-proxys',
  templateUrl: './proxys.component.html',
  styleUrls: ['./proxys.component.scss']
})
export class ProxysComponent implements OnInit {

  public proxys: Proxy[];
  private proxyBase = `${environment.apiEndPoint}/secured/proxy`;
  private proxytoken: string;

  constructor(private proxysService: ProxysService, private sanitizer: DomSanitizer, public dialog: MatDialog) { }

  ngOnInit() {
    this.proxysService.getProxyToken().toPromise().then(
      response => {
        this.proxytoken = response.token;
        return this.proxysService.getProxys().subscribe(data => {
          this.proxys = data.map(value => (
            // tslint:disable-next-line:max-line-length
            { ...value, completeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(`${this.proxyBase}?JWT=${this.proxytoken}${value.customHeader ? '&customHeader=' + encodeURIComponent(value.customHeader) : ''}&url=[${value.url}]`) }
          ));
        }, err => {
          console.log(err);
        });
      });

  }

  addProxy() {
    const dialogRef = this.dialog.open(AddProxyDialogComponent);
    dialogRef.afterClosed().subscribe(proxy => {
      if (proxy) {
        // tslint:disable-next-line:max-line-length
        proxy.completeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.proxyBase}?JWT=${this.proxytoken}${proxy.customHeader ? '&customHeader=' + encodeURIComponent(proxy.customHeader) : ''}&url=[${proxy.url}]`);
        this.proxys.push(proxy);
      }
    });
  }

  save() {
    this.proxysService.setProxys(this.proxys).toPromise().then(value => { this.proxysService.getProxys().subscribe(data => this.proxys); });
  }

  delete(proxy: Proxy) {
    this.proxys.splice(this.proxys.findIndex(value => value.url === proxy.url), 1);
  }

  /* Observable way (doesn't work : bug : https://github.com/ReactiveX/rxjs/issues/3064)
  this.proxysService.getProxyToken()
      .switchMap(data => {
        this.proxytoken = data.token;
        return this.proxysService.getProxys();
      })
      .subscribe(data => {
        this.proxys = data.map(value => (
          { ...value, completeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(`${this.proxyBase}?JWT=${this.proxytoken}${value.customHeader ? '&customHeader=' + value.customHeader : ''}&url=[${value.url}]`) }
        ));
      }, err => {
        console.log(err);
      });
  }
  */

}
