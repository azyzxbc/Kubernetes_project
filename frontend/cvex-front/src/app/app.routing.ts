import { Route } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { LoginComponent } from './modules/components/login/login.component';
import { NoAuthGuard } from './core/auth/guards/noAuth.guard';
import { UserProfileComponent } from './modules/components/admin/user-profile/user-profile.component';
import { AuthGuard } from '@auth0/auth0-angular'; // Import Auth0 AuthGuard
import { RolesGuard } from './utility/roleGuard ';
export const appRoutes: Route[] = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NoAuthGuard],
    },
    {
        path: '',
        redirectTo: '/emplois/tous-les-emplois',
        pathMatch: 'full',
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'profile',
                component: UserProfileComponent,
            },
            {
                path: 'administration',
                loadChildren: () =>
                    import(
                        'app/modules/components/admin/administration/Administration.module'
                    ).then((m) => m.AdministrationModule),
                canActivate: [RolesGuard],
                data: { roles: ['super admin', 'admin', 'hiring manager'] },
            },
            {
                path: 'emplois',
                loadChildren: () =>
                    import('app/modules/components/admin/Job/JOB.module').then(
                        (m) => m.JOBModule
                    ),
                canActivate: [RolesGuard],
                data: {
                    roles: [
                        'super admin',
                        'hiring member',
                        'admin',
                        'hiring manager',
                    ],
                },
            },
            {
                path: 'error',
                children: [
                    {
                        path: '400',
                        loadChildren: () =>
                            import(
                                'app/modules/components/admin/error/error-404/error-404.module'
                            ).then((m) => m.Error404Module),
                    },
                    {
                        path: '500',
                        loadChildren: () =>
                            import(
                                'app/modules/components/admin/error/error-500/error-500.module'
                            ).then((m) => m.Error500Module),
                    },
                ],
            },
        ],
    },
    {
        path: '**',
        redirectTo: '/emplois/tous-les-emplois',
    },
];
