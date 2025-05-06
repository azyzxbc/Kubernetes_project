import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'app/core/user/user.service';

@Injectable({
    providedIn: 'root',
})
export class RolesGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const requiredRoles: string[] = route.data['roles']; // Récupérer les rôles requis depuis la route
        const userRoles: string[] | null = this.userService.roles; // Récupérer les rôles de l'utilisateur

        if (!userRoles || !requiredRoles) {
            this.router.navigateByUrl('/error/400'); 
            return false;
        }

        const hasAccess = requiredRoles.some((role) => userRoles.includes(role)); 

        if (!hasAccess) {
            this.router.navigateByUrl('/error/500'); 
            return false;
        }

        return true; 
    }
}