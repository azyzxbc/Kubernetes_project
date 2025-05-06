import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    getToken(): string | null {
        return localStorage.getItem('access_token'); // Adjust this if you store tokens elsewhere
    }

    isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) return true;

        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
            return decoded.exp < currentTime; // Token is expired if `exp` is less than current time
        } catch (error) {
            return true; // If decoding fails, assume token is invalid
        }
    }
}
