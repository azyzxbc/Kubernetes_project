import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    errorMessage: string | null = null;
    constructor(
        private authService: AuthService,
        private _splashLoader: FuseSplashScreenService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.login();
    }
    login(): void {
        this._splashLoader.show();
        this.authService.loginWithRedirect().subscribe({
            next: () => {
                this._splashLoader.hide();            },
            error: (err) => {
                console.error(err);
            },
        });
    }
}
