import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FuseCardModule } from '@fuse/components/card';
import { CommonModule } from '@angular/common';
import { AdministrationComponent } from './Administration.component';
import { AdministrationRoutes } from './Adminstration-routing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ContactsDetailsComponent } from './details/details.component';
import { TranslocoModule } from '@ngneat/transloco';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EditClientComponent } from './edit-client/edit-client.component';
import { ClientsComponent } from './all-clients/clients.component';
import { DetailClientComponent } from './detail-client/detail-client.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [
        AdministrationComponent,
        ContactsDetailsComponent,
        EditClientComponent,
        ClientsComponent,
        DetailClientComponent
    ],
    imports: [
        RouterModule.forChild(AdministrationRoutes),
        FuseCardModule,
        MatIconModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatSidenavModule,
        TranslocoModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatDialogModule,
        SharedModule
    ],
})
export class AdministrationModule {}
