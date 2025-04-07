import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
        path: '',
        redirectTo: 'home', 
        pathMatch: 'full' 
    },
    {
        path: '',
        loadChildren: () => import('./home/page.routes').then((m) => m.PageRoutes),
    }
];
