import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";



@Injectable({
  providedIn: 'root'
})
export class NotificationService {
    private readonly snackBar: MatSnackBar = inject(MatSnackBar);

    private readonly defaultDuration = 3000; // 3 seconds

    



    public showError(message: string): void {
        this.snackBar.open(message, 'x', {
        duration: this.defaultDuration,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
        });
    }

    public showSuccess(message: string): void {
        this.snackBar.open(message, 'x', {
        duration: this.defaultDuration,
        panelClass: ['success-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
        });
    }

    public showInfo(message: string): void {
        this.snackBar.open(message, 'x', {
        duration: this.defaultDuration,
        panelClass: ['info-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
        });
    }

}