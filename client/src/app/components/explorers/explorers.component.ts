import { Component, OnInit } from '@angular/core';
import { ExplorerComponent } from './explorer/explorer.component';
import { FilesaclService } from '../../services/filesacl.service';
import { AuthService } from '../../services/auth.service';
import { FilesAC } from '../../../../../common/interfaces';
import { appAnimations } from '../../animations';

@Component({
  selector: 'app-explorers',
  templateUrl: './explorers.component.html',
  styleUrls: ['./explorers.component.css'],
  providers: [FilesaclService],
  animations: [appAnimations]
})
export class ExplorersComponent implements OnInit {

  public filesacl: FileACFront[];

  constructor(private fileACLService: FilesaclService, private authService: AuthService) { }

  ngOnInit() {
    this.fileACLService.getFilesACL().subscribe(data => {
      this.filesacl = data.filter(fileac => fileac.roles.includes(this.authService.getRoleFromToken()));
    });
  }

  currentPathChanged(event: [string, string]) {
    this.filesacl.find(value => value.name === event[0]).currentPath = event[1];
  }

}

interface FileACFront extends FilesAC {
    currentPath?: string;
}
