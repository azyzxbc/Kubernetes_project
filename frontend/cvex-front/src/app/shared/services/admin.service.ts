import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
@Injectable({
    providedIn: 'root',
})
export class AdminService {
    results: any[] = [];
    token: string;
    private sharedVariable: any;

    constructor(private _httpClient: HttpClient, authService: AuthService) {
        this.token = authService.accessToken;
        console.log('TOKEEEEEN FROM ADMIN SERVICE', this.token);
    }

}
