import {
    Directive,
    Input,
    OnInit,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';

import { AuthService } from '../services/auth.service';

@Directive({ selector: '[appShowToRoles]' })
export class ShowToRolesDirective implements OnInit {
    constructor(
        private templateRef: TemplateRef<any>,
        private authService: AuthService,
        private viewContainer: ViewContainerRef
    ) { }

    rolesArray: string[];

    @Input() set appShowToRoles(rolesArray: string[]) {
        this.rolesArray = rolesArray;
    }

    ngOnInit() {
        this.authService.userRole.subscribe(
            (userRole) => {
                if (this.rolesArray.includes(userRole) || (userRole !== 'not_logged' && this.rolesArray.includes('*'))) {
                    this.viewContainer.createEmbeddedView(this.templateRef);
                } else {
                    this.viewContainer.clear();
                }
            }
        );
    }

}
