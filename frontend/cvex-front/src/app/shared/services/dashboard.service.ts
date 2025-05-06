import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    constructor(private httpclient: HttpClient) {}

    dashboards(): Observable<any> {
        return this.httpclient.post<any>(
            `${environment.base_url}/api/dashboards/`, null
        );
    }
}
