import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    public permissions: string[] = [];

    constructor() {}

    setPermissions(permissions: string[]): void {
        this.permissions = permissions;
    }

    hasPermission(permission: string): boolean {
        return this.permissions.includes(permission);
    }

    hasAnyPermission(requiredPermissions: string[]): boolean {
        return requiredPermissions.some((perm) => this.permissions.includes(perm));
    }
}
