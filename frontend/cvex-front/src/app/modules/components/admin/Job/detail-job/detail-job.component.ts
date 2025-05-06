import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-detail-job',
    templateUrl: './detail-job.component.html',
    styleUrls: ['./detail-job.component.scss'],
})
export class DetailJobComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<DetailJobComponent>
    ) {
    }
    close(): void {
        this.dialogRef.close();
    }
}
