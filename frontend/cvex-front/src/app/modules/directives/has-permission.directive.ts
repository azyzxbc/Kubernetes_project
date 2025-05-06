import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionService } from 'app/shared/services/permission.service';
@Directive({
    selector: '[hasPermission]'
})
export class HasPermissionDirective {
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private permissionService: PermissionService
    ) {}

    @Input() set hasPermission(permission: string) {
        if (this.permissionService.hasPermission(permission)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
