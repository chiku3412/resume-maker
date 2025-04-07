import { Routes } from '@angular/router';

export const PageRoutes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./home.component').then((m) => m.HomeComponent),
    },
];
