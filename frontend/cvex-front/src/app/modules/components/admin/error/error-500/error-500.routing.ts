import {Route} from '@angular/router';
import {Error500Component} from 'app/modules/components/admin/error/error-500/error-500.component';

export const error500Routes: Route[] = [
    {
        path: '',
        component: Error500Component
    }
];
