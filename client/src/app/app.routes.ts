import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ExplorersComponent } from './components/explorers/explorers.component';
import { RouteGuard } from './services/route.guard';
import { ProxysComponent } from './components/proxys/proxys.component';
import { UsersComponent } from './components/users/users.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: '',
        redirectTo: '/explorer',
        pathMatch: 'full',
        canActivate: [RouteGuard]
    },
    {
        path: 'explorer',
        component: ExplorersComponent,
        pathMatch: 'full',
        canActivate: [RouteGuard]
    },
    {
        path: 'proxys',
        component: ProxysComponent,
        pathMatch: 'full',
        canActivate: [RouteGuard]
    },
    {
        path: 'users',
        component: UsersComponent,
        pathMatch: 'full',
        canActivate: [RouteGuard]
    }
];
