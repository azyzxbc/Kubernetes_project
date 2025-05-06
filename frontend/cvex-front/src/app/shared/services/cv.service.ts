import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
@Injectable({
    providedIn: 'root',
})
export class CvService {
    constructor(private httpclient: HttpClient) {}
    submit(cv: any, format: any): Observable<any> {
        const formData = new FormData();
        formData.append('cv', JSON.stringify(cv)); // Assuming cv is an object
        formData.append('format', format);

        return this.httpclient.post<any>(
            `${environment.base_url}/api/exportcv/`,
            formData
        );
    }

    submitcv(cv: any): Observable<any> {
        return this.httpclient.put<any>(
            `${environment.base_url}/api/submit/`,
            cv
        );
    }

    embed(cv: any): Observable<any> {
        return this.httpclient.post<any>(
            `${environment.base_url}/api/embed/`,
            cv
        );
    }

    submitlinkedin(type: string, format: string, cv: any): Observable<any> {
        return this.httpclient.post<any>(
            `${environment.base_url}/api/linkedin/linkedin1/`,
            { type, format, cv }
        );
    }

    savework(cv: any): Observable<any> {
        return this.httpclient.put<any>(
            `${environment.base_url}/api/savework/`,
            cv
        );
    }

    getFileFromUrl(url: string): Observable<any> {
        // Make an HTTP GET request to fetch the file from the provided URL
        return this.httpclient.get(url, { responseType: 'blob' }); // Use responseType: 'blob' for binary files like PDFs
    }

    getForm(id: number): Observable<any> {
        const body = {
            id_candidat: id,
        };
        return this.httpclient.put(`${environment.base_url}/api/cvForm/`, body); // Use responseType: 'blob' for binary files like PDFs
    }
}
