import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CvEnAttenteService {
    constructor(private httpclient: HttpClient) {}

    // getallCv(statusFilters: string[]): Observable<any> {
    //     const params = new HttpParams().set('status', statusFilters.join(','));
    //     return this.httpclient.get<any>(`${environment.base_url}/api/candidats/`, { params });
    // }
    getAllCv(): Observable<any> {
        const body = {
            status: ['pending', 'in progress'],
        };
        return this.httpclient.post<any>(
            `${environment.base_url}/api/candidats/`,
            body
        );
    }
    getNextOrPreviousData(nextUrl): Observable<any> {
        const body = {
            status: ['pending', 'in progress'],
        };
        return this.httpclient.post<any>(nextUrl, body);
    }
    deleteFile(id_candidat: any): Observable<any> {
        return this.httpclient.delete<any>(
            `${environment.base_url}/api/candidats/${id_candidat}/`
        );
    }
    createdomine(domaine): Observable<any> {
        return this.httpclient.post<any>(
            `${environment.base_url}/api/domaines/`,
            domaine
        );
    }

    deleteDomain(id_domaine: string): Observable<any> {
        return this.httpclient.delete<any>(
            `${environment.base_url}/api/domaines/`,
            { body: { id_domaine } }
        );
    }

    updatedomine(domaine: any): Observable<any> {
        return this.httpclient.put<any>(
            `${environment.base_url}/api/domaines/`,
            domaine
        );
    }
}
