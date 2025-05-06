import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";
import {FormControl, ɵFormGroupValue, ɵTypedOrUntyped} from "@angular/forms";


@Injectable({
    providedIn: 'root'
})
export class LinkedinService {
    constructor(private httpclient: HttpClient) {
    }

    getCv(): Observable<any> {
        return this.httpclient.get<any>('');
    }

    linkedinurl(data: ɵTypedOrUntyped<{
        n_page: FormControl<string | null>;
        options: FormControl<string | null>;
        keyword: FormControl<string | null>;
    }, ɵFormGroupValue<{
        n_page: FormControl<string | null>;
        options: FormControl<string | null>;
        keyword: FormControl<string | null>;
    }>, any>): Observable<any> {
        return this.httpclient.post<any>(`${environment.base_url_linkedin}/api/linkedin/`, data);
    }

    linkedinsearch(data: string): Observable<any> {
        return this.httpclient.post<any>(`${environment.base_url_linkedin}/api/linkedin/`, data);
    }
}
