import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlusDetailsService } from 'app/shared/services/plus-details.service';
@Component({
    selector: 'app-job-notes',
    templateUrl: './job-notes.component.html',
    styleUrls: ['./job-notes.component.scss'],
})
export class JobNotesComponent {
    comments = {
        note_dg: '',
        note_rh: '',
        note_technique: '',
        note_test_technique: '',
    };
    originalData: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<JobNotesComponent>,
        private plusDetailsService: PlusDetailsService
    ) {
        this.originalData = {
            note_rh: data?.note_rh || 'Test',
            note_technique: data?.note_technique || 'Test',
            note_dg: data?.note_dg || 'Test',
            note_test_technique: data?.note_test_technique || 'Test',
        };

        this.comments = { ...this.originalData };
        console.log('ORIGINAL DATAAA', this.data);
        
    }
    saveNotes(): void {
        // Récupérez uniquement les champs modifiés
        const updatedFields = this.getUpdatedFields();

        // Si aucun champ n'a changé, fermez simplement la boîte de dialogue
        if (Object.keys(updatedFields).length === 0) {
            alert('No changes detected.');
            this.dialogRef.close();
            return;
        }
        const updatedNotesWithiD = {
            id: this.data.id,
            ...updatedFields,
        };
        // Envoyez les champs modifiés via le service
        this.plusDetailsService.updateCandidateNotes(updatedNotesWithiD).subscribe({
            next: (res) => {
                console.log('Notes updated successfully');
                this.dialogRef.close();
            },
        });
    }

    private getUpdatedFields(): any {
        const updatedFields: any = {};

        // Comparez chaque champ pour détecter les changements
        for (const key in this.comments) {
            if (
                this.comments.hasOwnProperty(key) &&
                this.comments[key] !== this.originalData[key]
            ) {
                updatedFields[key] = this.comments[key];
            }
        }

        return updatedFields;
    }
}
