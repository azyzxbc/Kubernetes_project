import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
@Injectable({
    providedIn: 'root',
})
export class AllcvService {
    constructor(private http: HttpClient) {}

    getAllCandidats(): Observable<any> {
        const body = {
            status: ['completed'],
        };
        return this.http.post<any>(
            `${environment.base_url}/api/candidats/`,
            body
        );
    }

    getJobForCondidate(id: any): Observable<any> {
        console.log('Candiat id ', id);
        console.log('Candiat id type', typeof(id));
        const body = {
            id_candidat: id,
        };
        return this.http.post<any>(
            `${environment.base_url}/api/getjobsforcandidate/`,
            body
        );
    }
}
