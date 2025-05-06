import Swal from 'sweetalert2';
import { Component, OnInit, ViewChild } from '@angular/core';
import { JobsService } from 'app/shared/services/jobs.service';
import { Router } from '@angular/router';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClientServices } from 'app/shared/services/client.services';
import { JobNewComponent } from '../job_new/job-new.component';
import { EditJobComponent } from '../job-edit/edit-job.component';
import { MatDialog } from '@angular/material/dialog';
import { DetailJobComponent } from '../detail-job/detail-job.component';
import { takeUntil, finalize, map, startWith } from 'rxjs/operators';

import { Job, JobResponse } from 'app/modules/models/job.model';
import { Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { Client } from 'app/modules/models/client.model';
@Component({
    selector: 'app-all-jobs.',
    templateUrl: './all-jobs.component.html',
    styleUrls: ['./all-jobs.component.scss'],
})
export class AllJobsComponent implements OnInit {
    @ViewChild(MatTable) table!: MatTable<any>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    cards = [{ title: 'placement' }];
    url: any;
    fileDataSource = new MatTableDataSource<any>();
    displayedColumns: string[] = [
        'file_name',
        'location',
        'salaire_maximum',
        'salaire_minimum',
        'note',
        'start_date',
        'job_status',
        'destination',
        'target_client',
        'actions',
    ];
    currentPage = 1;
    totalItems = 0;
    searchValue: string = '';
    nextPage: string = '';
    previousPage: string = '';
    statuses: string[] = ['open', 'on hold', 'completed', 'canceled'];
    tooltipVisible = false;
    clients: Client[] = [];
    activeNoteIndex: number | null = null;
    isLoading: boolean = false;
    private unsubscribe$ = new Subject<void>();

    searchQuery$ = new BehaviorSubject<string>('');

    constructor(
        private jobsService: JobsService,
        private router: Router,
        private clientServices: ClientServices,
        private dialog: MatDialog
    ) {}
    ngOnInit(): void {
        this.getAllClient();
        this.jobsService.getJobs().subscribe();
        combineLatest([
            this.jobsService.jobs$,
            this.searchQuery$.pipe(startWith('')),
            this.clientServices.getAllClient(),
        ])
            .pipe(
                map(([jobs, query, clients]) => {
                    this.clients = clients.results;
                    return this.filterJobs(jobs, query);
                })
            )
            .subscribe((filteredJobs) => {
                this.fileDataSource.data = filteredJobs;
                this.totalItems = filteredJobs.length;
            });
    }

    ngAfterViewInit() {
        this.fileDataSource.sort = this.sort;
    }
    private filterJobs(jobs: Job[], query: string): Job[] {
        if (!query) return jobs;

        const searchString = query.toLowerCase();
        return jobs.filter((job) => {
            const jobName = job.file_name?.toLowerCase() || '';
            const jobDescription = job.description?.toLowerCase() || '';
            const jobLocation = job.location?.toLowerCase() || '';
            const jobClientName = this.getClientNameByID(job.target_client);

            return (
                jobName.includes(searchString) ||
                jobDescription.includes(searchString) ||
                jobLocation.includes(searchString) ||
                jobClientName.toLowerCase().includes(searchString)
            );
        });
    }

    getClientNameByID(id: number): string {
        if (!this.clients || this.clients.length === 0) {
            console.warn('Clients list is empty or not initialized');
            return 'Client inconnu';
        }

        if (id === null || id === undefined) {
            console.warn('Invalid ID:', id);
            return 'Client inconnu';
        }

        const client = this.clients.find((client) => client.id === id);
        return client ? client.nom_client : 'Client inconnu';
    }

    applyFilter(query: string): void {
        this.searchQuery$.next(query);
    }

    refreshData(): void {
        this.getAllClient();
        this.loadFiles();
    }

    viewJobDetails(job: any): void {
        this.dialog.open(DetailJobComponent, {
            width: '700px',
            data: job,
        });
    }

    viewAddJob(): void {
        const dialogRef = this.dialog.open(JobNewComponent, {
            width: '700px',
            disableClose: true,
        });
        dialogRef
            .afterClosed()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((newJob: Job) => {
                if (newJob) {
                }
            });
    }

    viewEditJob(idJob: number): void {
        this.jobsService.getJobById(idJob).subscribe((job) => {
            const dialogRef = this.dialog.open(EditJobComponent, {
                width: '700px',
                data: job,
                disableClose: true,
            });
            dialogRef
                .afterClosed()
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((newJob: Job) => {
                    if (newJob) {
                        this.jobsService.createJob(newJob).subscribe();
                    }
                });
        });
    }

    loadFiles(nextUrl?: string): void {
        this.isLoading = true;
        this.jobsService
            .getJobs()
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
                next: (data) => {
                    this.fileDataSource.data = data.results;
                    this.totalItems = data.count;
                    this.nextPage = data.next;
                    this.previousPage = data.previous;
                },
                error: (err) => console.error('Error fetching jobs:', err),
            });
    }

    onButtonClicked(id_job: number): void {
        this.router.navigate([`emplois/condidat-compatibles/${id_job}`]);
    }

    toggleVisibleNote(index: number): void {
        this.activeNoteIndex = this.activeNoteIndex === index ? null : index;
    }

    getAllClient(): void {
        this.clientServices.getAllClient().subscribe((data: any) => {
            this.clients = data.results;
        });
    }

    toggleTooltip() {
        this.tooltipVisible = !this.tooltipVisible;
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'open':
                return '#1e40af';
            case 'on hold':
                return '#DAA520';
            case 'completed':
                return '#388e3c';
            case 'canceled':
                return '#e74c3c';
            default:
                return '#000000';
        }
    }

    deleteOrArchiveJobById(id_job: number): void {
        Swal.fire({
            title: 'What do you want to do?',
            text: 'You can either delete or archive this job.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                this.jobsService.deleteJob(id_job).subscribe({
                    next: () => {
                        Swal.fire(
                            'Deleted!',
                            'The job has been deleted.',
                            'success'
                        );
                    },
                    error: (err) => {
                        Swal.fire(
                            'Error',
                            'Failed to delete the job.',
                            'error'
                        );
                        console.error('Error deleting job:', err);
                    },
                });
            } 
        });
    }

    onStatusChange(file: any, newStatus: string): void {
        console.log(
            'onStatusChange triggered with file:',
            file,
            'and new status:',
            newStatus
        );
        try {
            if (file) {
                this.jobsService.editJobStatus(file.id, newStatus).subscribe(
                    (response) => {
                        console.log(
                            'Job status updated successfully:',
                            response
                        );
                    },
                    (error) => {
                        console.error('Error updating job status:', error);
                    }
                );
            } else {
                console.error('File is undefined or null');
            }
        } catch (error) {
            console.error('Unexpected error occurred:', error);
        }
    }

    handlePageEvent(event: PageEvent): void {
        const nextUrl =
            event.pageIndex > event.previousPageIndex
                ? this.nextPage
                : this.previousPage;
        if (nextUrl) {
            this.loadFiles(nextUrl);
        }
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
