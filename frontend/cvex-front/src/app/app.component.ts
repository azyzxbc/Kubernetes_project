import { Component, OnInit } from '@angular/core';
import { UserService } from './core/user/user.service';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(
        private userService: UserService,
        private auth: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // this.auth.isAuthenticated$.subscribe((authenticated) => {
        //     if (authenticated) {
        //         this.router.navigate(['/dashboards']);
        //     }
        // });
        this.userService.loadUserData(); // Charger les tokens et rôles au démarrage
    }
}
