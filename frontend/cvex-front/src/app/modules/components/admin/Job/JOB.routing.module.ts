import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobNewComponent } from './job_new/job-new.component';
import { AllJobsComponent } from './all-jobs/all-jobs.component';
import { PlusDetailsComponent } from './interview/interview.component';
import { RolesGuard } from 'app/utility/roleGuard ';

const routes: Routes = [
    {
        path: '',
        component: JobNewComponent,
        canActivate: [RolesGuard],
        data: {
            roles: ['super admin', 'admin', 'hiring manager', 'hiring member'],
        },
    },
    {
        path: 'tous-les-emplois',
        component: AllJobsComponent,
        canActivate: [RolesGuard],
        data: {
            roles: ['super admin', 'admin', 'hiring manager', 'hiring member'],
        },
    },
    {
        path: 'condidat-compatibles/:id',
        component: PlusDetailsComponent,
        canActivate: [RolesGuard],
        data: {
            roles: ['super admin', 'admin', 'hiring manager', 'hiring member'],
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class JOBRoutingModule {}
