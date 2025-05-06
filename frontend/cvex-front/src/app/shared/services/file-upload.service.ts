import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class FileUploadService {
    constructor(private httpclient: HttpClient) {}

    // Returns an observable
    upload(file): Observable<any> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.httpclient.post(
            `${environment.base_url}/api/cv/`,
            formData
        );
    }

    uploadJobWithFile(formData): Observable<any> {
        return this.httpclient.post(
            `${environment.base_url}/api/Job/`,
            formData
        );
    }
    editJobWithFile(id: number, formData): Observable<any> {
        return this.httpclient.put(
            `${environment.base_url}/api/Job/${id}/`,
            formData
        );
    }
    archiveCandidate(file, data): Observable<any> {
        const formData = new FormData();
        formData.append('file', file, file.name); // Ajout du fichier
        formData.append('id_candidat', data.id); // Ajout de l'ID du candidat
        formData.append(
            'archived_id',
            data.archived_id ? data.archived_id : data.id
        ); // Ajout de l'ID d'archivage

        return this.httpclient.post<any>(
            `${environment.base_url}/api/archived/`,
            formData
        );
    }
}
