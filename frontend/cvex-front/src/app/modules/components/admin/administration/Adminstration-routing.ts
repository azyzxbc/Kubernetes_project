import { Route } from '@angular/router';
import { ContactsDetailsComponent } from './details/details.component';
import { ClientsComponent } from './all-clients/clients.component';
import { RolesGuard } from 'app/utility/roleGuard ';
export const AdministrationRoutes: Route[] = [
    {
        path: 'clients',
        component: ClientsComponent,
        canActivate: [RolesGuard],
        data: { roles: ['super admin', 'admin'] },
    },
    {
        path: 'contacts-details',
        component: ContactsDetailsComponent,
    },
];
