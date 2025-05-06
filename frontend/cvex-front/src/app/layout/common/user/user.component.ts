import { AuthService } from '@auth0/auth0-angular';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation,
    Inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
// import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { UserProfile } from 'app/modules/models/User.model';
@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user',
})
export class UserComponent {
    static ngAcceptInputType_showAvatar: BooleanInput;
    userProfile: UserProfile | null = null;
    firstLetter: string = '';
    secondLetter: string = '';
    @Input() showAvatar: boolean = true;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _authService: AuthService,
        private _router: Router,
        @Inject(DOCUMENT) public document: Document,
        private _changeDetectorRef: ChangeDetectorRef,
        private userService: UserService
    ) {
        this.userProfile = this.userService.userProfile;
    }

    goToProfile(): void {
        this._router.navigate(['/profile']);
    }
    goToSettings(): void {
        this._router.navigate(['/settings']);
    }

    logout() {
        console.log("Logout function called");
    
        this._authService.logout({
            logoutParams: { returnTo: document.location.origin },
        }).subscribe({
            next: () => {
                console.log("Logout successful, redirecting...");
            },
            error: (error) => {
                console.error("Logout error:", error);
            }
        });
    }
    
    
}
