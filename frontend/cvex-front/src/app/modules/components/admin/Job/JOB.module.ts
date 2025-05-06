import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FuseCardModule } from '@fuse/components/card';
import { CommonModule } from '@angular/common';
import { AllJobsComponent } from './all-jobs/all-jobs.component';
import { JOBRoutingModule } from './JOB.routing.module';
import { JobNewComponent } from './job_new/job-new.component';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PlusDetailsComponent } from './interview/interview.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TranslocoModule } from '@ngneat/transloco';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { EditJobComponent } from './job-edit/edit-job.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DetailJobComponent } from './detail-job/detail-job.component';
import { JobNotesComponent } from './job-notes/job-notes.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [
        AllJobsComponent,
        JobNewComponent,
        PlusDetailsComponent,
        EditJobComponent,
        DetailJobComponent,
        JobNotesComponent,
    ],
    imports: [
        JOBRoutingModule,
        FuseCardModule,
        MatIconModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        CdkScrollableModule,
        MatOptionModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTableModule,
        MatPaginatorModule,
        TranslocoModule,
        MatSidenavModule,
        MatTooltipModule,
        NgxSpinnerModule,
        MatTabsModule,
        MatCardModule,
        MatSortModule,
        MatDialogModule,
        MatCheckboxModule,
        SharedModule
    ],

})
export class JOBModule {}
