import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Location } from '@angular/common';
import { PlusDetailsService } from 'app/shared/services/plus-details.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { concatMap, finalize } from 'rxjs';
import { JobsService } from 'app/shared/services/jobs.service';
import { JobNotesComponent } from '../job-notes/job-notes.component';
import { forkJoin, of, map } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-interview',
    templateUrl: './interview.component.html',
    styleUrls: ['./interview.component.scss'],
})
export class PlusDetailsComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    title: string;
    card: any;
    jobiD: number;
    candidates: any[] = [];
    favorite = [];
    fileNames: any[] = [];
    candidatesData: any[] = [];
    isLoading: boolean = false;
    activeTabIndex: number = 0; // Default to the first tab
    statuses: string[] = ['not started', 'in progress', 'rejected', 'accepted'];
    displayedColumns: string[] = [
        'name',
        'score',
        'nbr_exp',
        'location',
        'link',
        'actions',
    ];
    displayedColumnsSelected: string[] = [
        'select',
        'id_candidat__nom',
        // 'id_candidat__email',
        'similarity_score',
        'id_candidat__phone',
        'rh',
        'technique',
        'test_technique',
        'dg',
        'id_candidat__CV_Link',
        'note',
        'defavori',
    ];
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private plusDetailService: PlusDetailsService,
        private jobsService: JobsService,
        private dialog: MatDialog
    ) {}

    refresh2Data(): void {
        this.plusDetailService
            .match(this.card.id)
            .pipe(
                concatMap((res2) => {
                    console.log(res2);
                    return this.plusDetailService.getcandidatesforjob(
                        this.card.id
                    );
                }),
                concatMap((res) => {
                    this.candidates = res.results;
                    console.log('candidates:', this.candidates); // Ajoutez ce journal
                    return this.plusDetailService.getselectedcandidate(
                        this.card.id
                    );
                }),
                finalize(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Data Refreshed',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                })
            )
            .subscribe((res1) => {
                this.candidatesData = res1.results; // Assurez-vous que res1.results est bien un tableau
                console.log('candidatesData:', this.candidatesData); // Ajoutez ce journal
            });
    }

    async refreshData(): Promise<void> {
        try {
            const timestamp = new Date().getTime(); // Paramètre aléatoire
            
            const candidates = await lastValueFrom(this.plusDetailService.getcandidatesforjob(this.card.id));
            this.candidates = candidates.results;
    
            const selectedCandidates = await lastValueFrom(this.plusDetailService.getselectedcandidate(this.card.id));
            this.candidatesData = selectedCandidates.results;
    
        } catch (err) {
            console.error('Error refreshing data:', err);
        }
    }
    viewJobNotes(id: number): void {
        const candidate = this.candidatesData.find(
            (candidate) => candidate.id === id
        );

        if (candidate) {
            this.dialog.open(JobNotesComponent, {
                width: '700px',
                data: candidate,
            });
        } else {
            Swal.fire({
                title: 'No Notes Found For This Candidate',
                input: 'text',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
            });
        }
    }

    goBackToPrevPage(): void {
        this.location.back();
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            const id = params['id'];
            this.jobiD = id;
    
            if (!id) {
                console.error('No ID found in the route parameters');
                return;
            }
    
            this.isLoading = true;
    
            // ✅ Suppression de l’appel à this.plusDetailService.match(id)
    
            forkJoin({
                jobDetails: this.jobsService.getJobById(id).pipe(
                    catchError((err) => {
                        console.error('Error fetching job details:', err);
                        return of(null);
                    })
                ),
                candidatesForJob: this.plusDetailService.getcandidatesforjob(id).pipe(
                    catchError((err) => {
                        console.error('Error fetching candidates for job:', err);
                        return of({ results: [] });
                    })
                ),
                selectedCandidates: this.plusDetailService.getselectedcandidate(id).pipe(
                    catchError((err) => {
                        console.error('Error fetching selected candidates:', err);
                        return of({ results: [] });
                    })
                ),
            }).subscribe(({ jobDetails, candidatesForJob, selectedCandidates }) => {
                this.card = jobDetails;
                this.candidates = candidatesForJob.results;
                this.candidatesData = selectedCandidates.results;
                this.isLoading = false;
            });
        });
    }
    
    goToTab(tabIndex: number): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { activeTab: tabIndex },
            queryParamsHandling: 'merge', // Preserve other query params
        });
    }

    candidateExists(candidate: any): boolean {
        if (Array.isArray(this.candidatesData)) {
            return this.candidatesData.some(
                (c) => c.id_candidat === candidate.id_candidat
            );
        }
        return false;
    }

    addCandidateToTable(candidate: any): void {
        this.plusDetailService
            .saveshortlisted(candidate.id)
            .subscribe((res) => {
                console.log(res);
                Swal.fire({
                    icon: 'success',
                    title: 'Added to Favorites',
                    showConfirmButton: false,
                    timer: 1500,
                });
                this.refreshData();
            });
    }

    openSweetAlert(note: string): void {
        Swal.fire({
            title: note ? 'Edit Note' : 'Add Note',
            input: 'text',
            inputValue: note,
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                // Handle saving the note here
                Swal.fire('Saved!', '', 'success');
            }
        });
    }

    updateCandidate(candidate: any): void {
        console.log(candidate);
        this.plusDetailService.updateCandidate(candidate).subscribe(() => {
            this.refreshData();
        });
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'not started':
                return '#1e40af';
            case 'in progress':
                return '#DAA520';
            case 'accepted':
                return '#388e3c';
            case 'rejected':
                return '#e74c3c';
            default:
                return '#000000';
        }
    }
    defavori(id): void {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This candidate will be removed from favorites!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'No, keep it',
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(id);
                this.plusDetailService.defavori(id).subscribe(() => {
                    Swal.fire(
                        'Removed!',
                        'Candidate has been removed from favorites.',
                        'success'
                    );
                    this.refreshData();
                });
            }
        });
    }
    toggleSelectAll(checked: boolean) {
        this.candidatesData.forEach((data) => {
            data.selected = checked;
        });
    }
    sendMail() {
        // Filtrer les candidats sélectionnés
        const selectedCandidates = this.candidatesData.filter(
            (candidate) => candidate.selected
        );
        console.log('SELECTEEED,', selectedCandidates);

        if (selectedCandidates.length > 0) {
            // Récupérer les adresses email des candidats sélectionnés
            const emailAddresses = selectedCandidates
                .map((candidate) => candidate.id_candidat__email) // Assurez-vous que le champ correspond à l'email
                .filter((email) => email) // Filtrer les valeurs nulles ou indéfinies
                .join(';');

            if (emailAddresses) {
                // Construire le lien mailto
                const mailtoLink = `mailto:${emailAddresses}`;
                window.open(mailtoLink, '_blank');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'No Valid Email Addresses',
                    text: 'None of the selected candidates have valid email addresses.',
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'No Candidates Selected',
                text: 'Please select at least one candidate to send the email.',
            });
        }
    }
}
