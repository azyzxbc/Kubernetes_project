import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientServices } from 'app/shared/services/client.services';
import { firstValueFrom } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from 'app/modules/models/client.model';
@Component({
    selector: 'app-edit-client',
    templateUrl: './edit-client.component.html',
    styleUrls: ['./edit-client.component.scss'],
})
export class EditClientComponent implements OnInit {
    clientForm: FormGroup;
    clientId: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Client,
        private dialogRef: MatDialogRef<EditClientComponent>,
        private fb: FormBuilder,
        private clientServices: ClientServices,
    ) {}

    ngOnInit(): void {
        this.clientForm = this.fb.group({
            nom_client: ['', Validators.required],
            adresse: ['', Validators.required],
            ville: ['', Validators.required],
            code_postale: ['', Validators.required],
            numero_fiscale: ['', Validators.required],
            telephone: ['', Validators.required],
            mobile: ['', Validators.required],
            courriel: ['', [Validators.required, Validators.email]],
            site_web: ['', Validators.required],
            langue: ['', Validators.required],
        });

        if (this.data) {
            this.clientId = this.data.id;
            this.clientForm.patchValue(this.data); 
        }
    }

    async onSubmit(): Promise<void> {
        if (this.clientForm.invalid) {
            this.clientForm.markAllAsTouched()
            return;
        }

        const updatedClient = this.clientForm.value;

        try {
            await firstValueFrom(
                this.clientServices.editClient(this.clientId, updatedClient)
            );
            this.close();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du client:', error);
        } finally {
            this.clientForm.reset();
        }
    }

    close(): void {
        this.dialogRef.close();
    }
}
