import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class NoAuthGuard {
    /**
     * Constructor
     */
    constructor(private _router: Router) {}
}
