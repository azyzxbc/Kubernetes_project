import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
@Injectable({
    providedIn: 'root',
})
export class PlusDetailsService {
    constructor(private httpclient: HttpClient) {}
    match(id: any): Observable<any> {
        const body = {
            job_id: id,
        };
        return this.httpclient.post<any>(
            `${environment.base_url}/api/match/`,
            body
        );
    }
    getcandidatesforjob(id: any): Observable<any> {
        const body = {
            id_job: id,
        };        
        return this.httpclient.post<any>(
            `${environment.base_url}/api/getcandidatesforjob/`,
            body
        );
    }
    getselectedcandidate(id: any): Observable<any> {
        const body = {
            id_job: id,
        };
        return this.httpclient.post<any>(
            `${environment.base_url}/api/getselectedcandidate/`,
            body
        );
    }
    saveshortlisted(id: any): Observable<any> {
        console.log('IDD FROM SHORTLIST', id);

        const body = {
            id: id,
            favori: true,
        };
        return this.httpclient.put<any>(
            `${environment.base_url}/api/saveshortlisted/`,
            body
        );
    }
    defavori(id: any): Observable<any> {
        console.log('IDD FROM SHORTLIST', id);

        const body = {
            id: id,
            favori: false,
        };
        return this.httpclient.put<any>(
            `${environment.base_url}/api/saveshortlisted/`,
            body
        );
    }

    updateCandidate(candidate: any): Observable<any> {
        const body = {
            id: candidate.id,
            dg: candidate.dg,
            rh: candidate.rh,
            technique: candidate.technique,
            test_technique: candidate.test_technique,
        };
        return this.httpclient.put<any>(
            `${environment.base_url}/api/updateshortlisted/`,
            body
        );
    }
    updateCandidateNotes(data: any): Observable<any> {
        return this.httpclient.put<any>(
            `${environment.base_url}/api/updateshortlisted/`,
            data
        );
    }
}
