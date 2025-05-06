import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';
import { UserService } from 'app/core/user/user.service';
import { UserProfile } from 'app/modules/models/User.model';
import { SnackNotificationService } from 'app/shared/services/snacknotification.service';
@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
    tooltipVisible: boolean = false;

    userDetailsForm: FormGroup;
    resetPasswordForm: FormGroup;
    userData: UserProfile;
    hideOld = true;
    hideNew = true;
    hideConfirm = true;
    constructor(
        private fb: FormBuilder,
        private userservice: UserService,
        private _snackBar: SnackNotificationService
    ) {
        this.userData = this.userservice.userProfile;
    }

    ngOnInit(): void {
        this.initForms();
    }
    passwordMatchValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const newPassword = control.get('newPassword')?.value;
            const confirmPassword = control.get('confirmPassword')?.value;
            return newPassword === confirmPassword
                ? null
                : { passwordMismatch: true };
        };
    }
    toggleTooltip(): void {
        this.tooltipVisible = !this.tooltipVisible;
    }
    private initForms(): void {
        this.userDetailsForm = this.fb.group({
            given_name: [ this.userData?.given_name || '', [Validators.required, Validators.minLength(3)]],
            family_name: [this.userData?.family_name || '', [Validators.required]],
            email: [
                this.userData?.email || '',
                [Validators.required, Validators.email],
            ],
            location: [this.userData.user_metadata.location || '', Validators.required],
            company: [this.userData.user_metadata.company ||'', Validators.required],
            phone_number: [this.userData.user_metadata.phone_number ||'', Validators.required],
        });

        this.resetPasswordForm = this.fb.group(
            {
                oldPassword: ['', Validators.required],
                newPassword: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(6),
                        Validators.pattern(
                            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/
                        ),
                    ],
                ],
                confirmPassword: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(6),
                        Validators.pattern(
                            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/
                        ),
                    ],
                ],
            },
            { validators: this.passwordMatchValidator() }
        );
    }
    // Method to update a user
    updateUserPassword() {
        if (this.resetPasswordForm.invalid) {
            this.resetPasswordForm.markAllAsTouched();
            return;
        }
        const formValues = this.resetPasswordForm.value;

        const userData = {
            user_id: this.userservice.userProfile.sub,
            payload: {
                password: formValues.newPassword,
            },
        };
        this.userservice.updateUser(userData).subscribe({
            next: (response) => {
                this._snackBar.showSuccess('Paswword updated successfully');
            },
            error: (err) => {
                this._snackBar.showError('Error updating password');
            },
        });
    }
    updateUserDetails() {
        if (this.userDetailsForm.invalid) {
            this.userDetailsForm.markAllAsTouched();
            return;
        }
        const formValues = this.userDetailsForm.value;
        const userData = {
            user_id: this.userservice.userProfile.sub,
            payload: {
                given_name: formValues.given_name,
                family_name: formValues.family_name,
                user_metadata: {
                    location: formValues.location,
                    company: formValues.company,
                    phone_number: formValues.phone_number,
                },
            },
        };

        this.userservice.updateUser(userData).subscribe({
            next: (response) => {
                this._snackBar.showSuccess(
                    'User details updated successfully !'
                );
            },
            error: (err) => {
                this._snackBar.showError('Error updating user details');
            },
        });
    }
}
