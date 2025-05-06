import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class OwencloudService {
    private apiUrl = 'https://abs-sirh-ats-storage.abshore.com/apps/files_sharing/api/v1/shares/';

    constructor(private http: HttpClient) {
    }

    fetchPdfFile(shareId: string): Observable<Blob> {
        // Assuming shareId is the ID of the shared file
        // You may need to adjust the API endpoint and parameters based on the ownCloud API documentation
        const url = `${this.apiUrl}${shareId}/download`;
        return this.http.get(url, {responseType: 'blob'});
    }
}
