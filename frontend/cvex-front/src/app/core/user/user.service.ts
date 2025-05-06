import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import { jwtDecode } from 'jwt-decode';
import { UserProfile, UserRole } from 'app/modules/models/User.model';
import { PermissionService } from 'app/shared/services/permission.service';
import { switchMap, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    public token: string | null = null;
    public roles: string[] | null = null;
    public permissions: string[] | null = null;
    public clientId: string | number | null = null;
    public userProfile: UserProfile | null = null;

    constructor(
        private permissionService: PermissionService,
        private authService: AuthService,
        private http: HttpClient
    ) {
        this.authService.user$.subscribe((user) => {
            this.userProfile = user;
            console.log('user', user);
        });
    }

    loadUserData(): void {
        this.authService.isAuthenticated$
            .pipe(
                switchMap((isAuthenticated) => {
                    if (isAuthenticated) {
                        return this.authService.getAccessTokenSilently();
                    } else {
                        return of(null);
                    }
                }),
                tap((token) => {
                    if (token) {
                        this.token = token;
                        console.log('Token chargé:', this.token);

                        // Décoder le token
                        const decodedToken: any = jwtDecode(token);
                        console.log('Token décodé:', decodedToken);

                        // Extraire les rôles
                        const namespace = 'https://app.matchnhire.com'; // Vérifie que ce namespace est correct
                        this.roles = decodedToken[`${namespace}/roles`] || [];
                        this.clientId =
                            decodedToken[`${namespace}/id_client`] || [];
                        this.permissions = decodedToken.permissions || []; // Extraction directe
                        this.permissionService.setPermissions(this.permissions);
                        console.log('Rôles récupérés:', this.roles);
                        console.log(
                            'Permissions récupérées:',
                            this.permissions
                        );
                        console.log('CLientID récupérées:', this.clientId);
                    }
                })
            )
            .subscribe();
    }
    // Méthode pour créer un utilisateur
    createUser(data: any): Observable<any> {
        return this.http.post<any>(
            `${environment.base_url}/api/Auth0User/`,
            data
        );
    }
    getAllUsersByClient(): Observable<{ message: any[] }> {
        return this.http.get<{ message: any[] }>(
            `${environment.base_url}/api/Auth0User/`
        );
    }

    // Méthode pour supprimer un utilisateur
    deleteUser(id: number): Observable<any> {
        return this.http.delete<any>(
            `${environment.base_url}/api/Auth0User/?user_id=${id}`
        );
    }

    // Méthode pour mettre à jour un utilisateur
    updateUser(data): Observable<any> {
        return this.http.put<any>(
            `${environment.base_url}/api/Auth0User/`,
            data
        );
    }
    // Méthode pour retrive all roles
    getRoles(): Observable<{ message: UserRole[] }> {
        return this.http.get<{ message: UserRole[] }>(
            `${environment.base_url}/api/Auth0Role/`
        );
    }
    assignRolesToUser(data): Observable<any> {
        return this.http.post<any>(
            `${environment.base_url}/api/Auth0AssignUserRole/`,
            data
        );
    }
    removeRolesFromUser(data): Observable<any> {
        return this.http.request<any>(
            'DELETE',
            `${environment.base_url}/api/Auth0UserRole/`,
            {
                body: data,
            }
        );
    }

    getRolesByUser(userId): Observable<any> {
        return this.http.get<any>(
            `${environment.base_url}/api/Auth0UserRole/?user_id=${userId}`
        );
    }
}
