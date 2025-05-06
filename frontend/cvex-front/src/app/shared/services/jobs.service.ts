import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { environment } from 'environments/environment';
import { tap, map } from 'rxjs/operators';
import { Job, JobResponse } from 'app/modules/models/job.model';

@Injectable({
    providedIn: 'root',
})
export class JobsService {
    constructor(private httpclient: HttpClient) {}
    private jobSubject = new BehaviorSubject<Job[]>([]);
    public jobs$ = this.jobSubject.asObservable();

    private searchQuerySubject = new BehaviorSubject<string>(''); 
    public searchQuery$ = this.searchQuerySubject.asObservable();
    
    getJobs(nextUrl?: string): Observable<JobResponse> {
        const url = nextUrl || `${environment.base_url}/api/Job/`;
        return this.httpclient.get<JobResponse>(url).pipe(
            tap((response) => {
                this.jobSubject.next(response.results);
            })
        );
    }
    setSearchQuery(query: string): void {
        this.searchQuerySubject.next(query); 
    }

    filterJobs(): Observable<Job[]> {
        return combineLatest([this.jobs$, this.searchQuery$]).pipe(
            map(([jobs, query]) => {
                if (!query) return jobs;
                const searchString = query.toLowerCase();
                return jobs.filter((job) =>
                    job.file_name?.toLowerCase().includes(searchString) ||
                    job.location?.toLowerCase().includes(searchString) ||
                    job.description?.toLowerCase().includes(searchString) 
                );
            })
        );
    }
    getJobById(id: number): Observable<Job> {
        return this.httpclient.get<Job>(
            `${environment.base_url}/api/Job/${id}/`
        );
    }

    uploadCountries(): Observable<any> {
        return this.httpclient.get<any>('https://restcountries.com/v3.1/all');
    }

    createJob(data: Job): Observable<any> {

        return this.httpclient
            .post(`${environment.base_url}/api/Job/`, data)
            .pipe(
                tap((newJob) => {                    
                    const updatedJobs = [newJob.data, ...this.jobSubject.value];
                    this.jobSubject.next(updatedJobs);
                })
            );
    }
    editJob(id: number, updatedJob: Job): Observable<Job> {
        return this.httpclient.put<Job>(`${environment.base_url}/api/Job/${id}/`, updatedJob).pipe(
            tap((editedJob) => {
                const updatedJobs = this.jobSubject.value.map((job) =>
                    job.id === id ? editedJob : job
                );
                this.jobSubject.next(updatedJobs);
            })
        );
    }
    
    deleteJob(id: any): Observable<any> {
        return this.httpclient
            .delete<any>(`${environment.base_url}/api/Job/${id}/`)
            .pipe(
                tap(() => {
                    const updatedJob = this.jobSubject.value.filter(
                        (job) => job.id !== id
                    );
                    this.jobSubject.next(updatedJob);
                })
            );
    }

    editJobStatus(id: number, newStatus: string): Observable<any> {
        const body = { job_status: newStatus };

        return this.httpclient
            .put<any>(`${environment.base_url}/api/Job/${id}/`, body)
            .pipe(
                tap(() => {
                    const updatedJobs = this.jobSubject.value.map((job) =>
                        job.id === id ? { ...job, job_status: newStatus } : job
                    );
                    this.jobSubject.next(updatedJobs);
                })
            );
    }
}
