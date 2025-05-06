import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackNotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showError(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['snackbar-error'],
    });
  }

  showSuccess(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['snackbar-success'],
    });
  }

  showWarning(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['snackbar-warning'],
    });
  }
}
