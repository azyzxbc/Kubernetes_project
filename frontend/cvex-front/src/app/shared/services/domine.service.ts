import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DomineService {
    constructor(private httpclient: HttpClient) {}

    getalldomine(): Observable<any> {
        // Pass null as the body
        return this.httpclient.post<any>(
            `${environment.base_url}/api/getdomain/`,
            null // Add null as the body parameter
        );
    }

    createdomine(domaine: any): Observable<any> {
        const body = { ...domaine };
        return this.httpclient.post<any>(
            `${environment.base_url}/api/domaines/`,
            body
        );
    }

    deleteDomain(id_domaine: string): Observable<any> {
        return this.httpclient.delete<any>(
            `${environment.base_url}/api/domaines/`,
            { body: { id_domaine } }
        );
    }

    updatedomine(domaine: any): Observable<any> {
        const body = { ...domaine };
        return this.httpclient.put<any>(
            `${environment.base_url}/api/domaines/`,
            body
        );
    }
}
