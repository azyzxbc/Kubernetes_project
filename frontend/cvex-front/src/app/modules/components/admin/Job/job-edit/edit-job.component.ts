import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientServices } from 'app/shared/services/client.services';
import { JobsService } from 'app/shared/services/jobs.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { FileUploadService } from 'app/shared/services/file-upload.service';
import { PlusDetailsService } from 'app/shared/services/plus-details.service';
import { Client } from 'app/modules/models/client.model';
@Component({
    selector: 'app-edit-job',
    templateUrl: './edit-job.component.html',
    styleUrls: ['./edit-job.component.scss'],
})
export class EditJobComponent implements OnInit {
    jobForm: FormGroup;
    jobId: number; // To store the client ID from the route
    activeTab: string = 'Formulaire'; // Par défaut, l'onglet 'form' est actif
    countries: string[] = [];
    clients: Client[];
    file: File = null; // Variable to store file to Upload
    files: any[] = [];
    code: any;
    fileName: string = '';
    isFileUploaded = false; // Indique si un fichier est téléchargé
    jobSelectedCandidate = [];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<EditJobComponent>,
        private fb: FormBuilder,
        private clientServices: ClientServices,
        private jobsService: JobsService,
        private fileUploadService: FileUploadService,
        private plusDetailsService: PlusDetailsService
    ) {}

    ngOnInit(): void {
        // Initialize form
        this.jobForm = this.fb.group({
            file_name: ['', Validators.required], // Corresponds to "file_name"
            description: ['', Validators.required], // Corresponds to "description"
            location: ['', Validators.required], // Corresponds to "location"
            salaire_minimum: ['', Validators.required], // Corresponds to "salaire_minimum"
            salaire_maximum: ['', Validators.required], // Corresponds to "salaire_maximum"
            note: ['', Validators.required], // Corresponds to "note"
            start_date: ['', Validators.required], // Corresponds to "start_date"
            job_status: ['', Validators.required], // Default "open"
            target_client: ['', Validators.required], // Default value as per the JSON (1)
            destination: ['', Validators.required],
        });
        // Fetch list of countries from API
        this.getAllCountries();
        this.getAllClient();

        // Subscribe to modal visibility and clientId changes
        if (this.data) {
            this.jobId = this.data.id;
            this.jobForm.patchValue(this.data); // Remplir le formulaire avec les données du client
        }
    }
    getAllClient(): void {
        this.clientServices.getAllClient().subscribe({
            next: (res) => {
                this.clients = res.results || [];
            },
            error: (err) => {
                console.error('Failed to fetch clients:', err);
            },
        });
    }

    getAllCountries(): void {
        this.jobsService.uploadCountries().subscribe({
            next: (res) => {
                this.countries = res || [];
            },
            error: (err) => {
                console.error('Failed to fetch countries:', err);
                this.countries = [];
            },
        });
    }

    setActiveTab(tab: string): void {
        this.activeTab = tab;
    }

    isTabActive(tab: string): boolean {
        return this.activeTab === tab;
    }

    onSubmit(): void {
        if (this.jobForm.invalid) {
            this.jobForm.markAllAsTouched()
            return;
        }
        const descriptionChanged =
            this.jobForm.value['description'] !== this.data.description;
        const fileUploaded = this.isFileUploaded;

        if (descriptionChanged || fileUploaded) {
            this.plusDetailsService.getcandidatesforjob(this.jobId).subscribe({
                next: (res) => {
                    this.jobSelectedCandidate = res.results;

                    if (this.jobSelectedCandidate.length > 0) {
                        Swal.fire({
                            title: 'Confirmation',
                            text: `This Changes Can Affect On ${this.jobSelectedCandidate.length} Selected Candidate(s) Continue ?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Oui, continuer',
                            cancelButtonText: 'Annuler',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.proceedWithEdit();
                            }
                        });
                    } else {
                        this.proceedWithEdit();
                    }
                },
                error: (err) => {
                    console.error(
                        'Erreur lors de la vérification des candidats :',
                        err
                    );
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur',
                        text: 'Impossible de vérifier les candidats sélectionnés.',
                    });
                },
            });
        } else {
            this.proceedWithEdit();
        }
    }

    proceedWithEdit(): void {
        // Créez une instance de FormData
        const formData = new FormData();

        // Ajoutez le fichier, s'il est présent
        if (this.isFileUploaded && this.fileName) {
            formData.append('file', this.files[0]);
        }

        // Ajoutez uniquement les données modifiées
        for (const key in this.jobForm.value) {
            if (
                this.jobForm.value[key] !== undefined &&
                this.jobForm.value[key] !== null
            ) {
                // Si c'est la description, vérifiez si elle a été modifiée avant de l'ajouter
                if (key === 'description') {
                    if (
                        this.jobForm.value['description'] !==
                        this.data.description
                    ) {
                        formData.append(key, this.jobForm.value[key]);
                    }
                } else {
                    formData.append(key, this.jobForm.value[key]);
                }
            }
        }
        const updatePayload = { ...this.jobForm.value };
        if (this.jobForm.value['description'] === this.data.description) {
            delete updatePayload['description'];
        }
        if (this.isFileUploaded) {
            this.fileUploadService
                .editJobWithFile(this.jobId, formData)
                .subscribe({
                    next: (res) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Job modifié avec succès',
                            showConfirmButton: false,
                            timer: 1500,
                        }).then(() => {
                            this.dialogRef.close(); // Fermer le dialogue
                        });
                    },
                    error: (err) => {
                        console.error(
                            'Erreur lors de la modification avec fichier :',
                            err
                        );
                    },
                });
        } else {
            this.jobsService.editJob(this.jobId, updatePayload).subscribe({
                next: (res) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Job modifié avec succès',
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(() => {
                        this.dialogRef.close(); // Fermer le dialogue
                    });
                },
                error: (err) => {
                    console.error('Erreur lors de la modification :', err);
                },
            });
        }
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.fileName = input.files[0].name; // Get the file name
            this.files = Array.from(input.files); // Convert FileList to array and store
            this.isFileUploaded = true; // Indicate that a file has been uploaded
            this.jobForm.get('description')?.disable(); // Disable description field if needed
        }
    }

    clearFile(): void {
        this.fileName = null;
        this.isFileUploaded = false; // Réactive le champ description
        this.jobForm.get('description')?.enable(); // Réactive explicitement le champ
    }
    prepareFilesList(files: File[]): void {
        for (const file of files) {
            file['progress'] = 0; // Initialize progress if needed
            this.files.push(file); // Add the file to your files array
        }
        this.uploadFilesSimulator(0); // Simulate file upload if needed
    }
    uploadFilesSimulator(index: number) {
        setTimeout(() => {
            if (index === this.files.length) {
                return;
            } else {
                const progressInterval = setInterval(() => {
                    if (this.files[index].progress === 100) {
                        clearInterval(progressInterval);
                        this.uploadFilesSimulator(index + 1);
                    } else {
                        this.files[index].progress += 5;
                    }
                }, 200);
            }
        }, 1000);
    }
    close(): void {
        this.dialogRef.close();
    }
}
