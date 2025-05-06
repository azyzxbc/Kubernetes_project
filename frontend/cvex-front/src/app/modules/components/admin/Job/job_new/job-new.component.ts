import { Component, OnInit, Inject } from '@angular/core';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { FileUploadService } from 'app/shared/services/file-upload.service';
import { ClientServices } from 'app/shared/services/client.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JobsService } from 'app/shared/services/jobs.service';
import { Client } from 'app/modules/models/client.model';
@Component({
    selector: 'app-add-newjob',
    templateUrl: './job_new.html',
    styleUrls: ['./job_new.component.scss'],
})
export class JobNewComponent implements OnInit {
    file: File = null; // Variable to store file to Upload
    files: any[] = [];
    code: any;
    countries: string[] = [];
    clients: Client[];
    fileName: string = '';
    isFileUploaded = false; // Indique si un fichier est téléchargé
    activeTab: string = 'Formulaire'; // Par défaut, l'onglet 'form' est actif
    form: FormGroup;
    application: any = {
        placmentname: '',
        placmentDescription: '',
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<JobNewComponent>,
        private fb: FormBuilder,
        public navCtrl: NgxNavigationWithDataComponent,
        private clientServices: ClientServices,
        private jobsService: JobsService,
        private fileUploadService: FileUploadService
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            job_name: ['', Validators.required], // Corresponds to "job_name"
            description: [''], // Corresponds to "description"
            location: ['Tunisia', Validators.required], // Corresponds to "location"
            salaire_minimum: ['', Validators.required], // Corresponds to "salaire_minimum"
            salaire_maximum: ['', Validators.required], // Corresponds to "salaire_maximum"
            note: ['', Validators.required], // Corresponds to "note"
            start_date: ['', Validators.required], // Corresponds to "start_date"
            job_status: ['', Validators.required], // Default "open"
            target_client: ['', Validators.required], // Default value as per the JSON (1)
            destination: ['', Validators.required],
        });

        this.getAllCountries();
        this.getAllClient();
    }

    triggerFileInput(): void {
        const fileInput = document.getElementById(
            'fileUpload'
        ) as HTMLInputElement;
        fileInput.click(); // Déclenche le clic sur l'input fichier
    }
    deleteFile(index: number): void {
        this.files.splice(index, 1);
        if (this.files.length === 0) {
            this.form.controls['description'].enable();
        }
    }
    getAllClient(): void {
        this.clientServices.getAllClient().subscribe({
            next: (res) => {
                this.clients = res.results;
            },
        });
    }
    getAllCountries(): void {
        this.jobsService.uploadCountries().subscribe((res) => {
            this.countries = res;
        });
    }

    /**
     * on file drop handler
     */
    onFileDropped($event) {
        this.prepareFilesList($event);
    }

    /**
     * handle file from browsing
     */
    fileBrowseHandler(files) {
        this.prepareFilesList(files);
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

    /**
     * Convert Files list to normal array list
     *
     * @param files (Files List)
     */

    /**
     * format bytes
     *
     * @param bytes (File size in bytes)
     * @param decimals (Decimals point)
     */

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched()
            return;
        }
        // Créer une instance de FormData
        const formData = new FormData();
        // Ajouter le fichier, s'il est présent
        if (this.isFileUploaded && this.fileName) {
            formData.append('file', this.files[0]);
        }

        // Ajouter toutes les données du formulaire, y compris la description
        for (const key in this.form.value) {
            if (
                this.form.value[key] !== undefined &&
                this.form.value[key] !== null
            ) {
                formData.append(key, this.form.value[key]);
            }
        }

        if (this.isFileUploaded) {
            this.fileUploadService.uploadJobWithFile(formData).subscribe({
                next: (res) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Job Submitted Successfully',
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(() => {
                        this.form.reset();
                        this.fileName = '';
                        this.isFileUploaded = false;
                        this.dialogRef.close();
                    });
                },
            });
        } else {
            this.jobsService.createJob(this.form.value).subscribe({
                next: (res) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Job Submitted Successfully',
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(() => {
                        this.form.reset();
                        this.fileName = '';
                        this.isFileUploaded = false;
                        this.dialogRef.close();
                    });
                },
            });
        }
    }

    close(): void {
        this.dialogRef.close();
    }
    onBackdropClicked(): void {
        // Go back to the list
        // this._router.navigate(['./'], {relativeTo: this._activatedRoute});
        //
        // // Mark for check
        // this._changeDetectorRef.markForCheck();
    }
    onDragOver(event: DragEvent): void {
        event.preventDefault();
        // Optionally add visual cues (like changing styles) to show that drop is allowed
    }

    onDragLeave(event: DragEvent): void {
        // Reset visual cues here when dragging leaves the drop zone
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        const files: FileList = event.dataTransfer.files;
        if (files.length > 0) {
            this.fileName = files[0].name;
        }
    }
    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.fileName = input.files[0].name;
            this.files = Array.from(input.files);
            this.isFileUploaded = true;
            this.form.get('description')?.disable();
        }
    }

    clearFile(): void {
        this.fileName = null;
        this.isFileUploaded = false;
        this.form.get('description')?.enable();
    }
    prepareFilesList(files: File[]): void {
        for (const file of files) {
            file['progress'] = 0;
            this.files.push(file);
        }
        this.uploadFilesSimulator(0);
    }
}
