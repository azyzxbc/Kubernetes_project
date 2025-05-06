import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { catchError } from 'rxjs/operators';
import { SnackNotificationService } from 'app/shared/services/snacknotification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private userService: UserService,
        private snackNotificationService: SnackNotificationService
    ) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.userService.token; 

        if (token) {
            const cloned = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` },
            });
            return next.handle(cloned).pipe(
                catchError((error) => {
                    if (error.status === 401) {
                        this.snackNotificationService.showError(
                            'Unauthorized access. Please log in again.'
                        );
                    } else {
                        this.snackNotificationService.showError(
                            'An error occurred. Please try again later.'
                        );
                    }
                    throw error;
                })
            );
        }

        return next.handle(req); 
    }
}
