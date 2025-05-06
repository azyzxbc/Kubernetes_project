import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { PermissionService } from './permission.service';

@Injectable({
    providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
    constructor(private permissionService: PermissionService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const requiredPermissions = route.data['permissions'] as string[];

        if (!this.permissionService.hasAnyPermission(requiredPermissions)) {
            console.log('Accès refusé - Permissions requises:', requiredPermissions);
            this.router.navigate(['/access-denied']); // Redirige si pas autorisé
            return false;
        }

        return true;
    }
}
