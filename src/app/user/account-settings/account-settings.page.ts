import { Component, OnInit } from '@angular/core';
import { AuthService, UserData } from '../../services/auth.service';
import { SystemSettingsService, CityInfo, VisionMission, CityOfficial } from '../../services/system-settings.service';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
    selector: 'app-account-settings',
    templateUrl: './account-settings.page.html',
    styleUrls: ['./account-settings.page.scss'],
    standalone: false
})
export class AccountSettingsPage implements OnInit {
    userData: UserData | null = null;
    contactNumber: string = '';
    originalContactNumber: string = '';
    fullName: string = '';
    fullAddress: string = '';
    memberSince: string = '';
    isEditMode: boolean = false;

    // Change Password fields
    currentPassword: string = '';
    newPassword: string = '';
    confirmPassword: string = '';
    showCurrentPassword: boolean = false;
    showNewPassword: boolean = false;
    showConfirmPassword: boolean = false;

    // System Settings Data
    cityLogo: string | null = null;
    cityInfo: CityInfo | null = null;
    visionMission: VisionMission | null = null;
    officials: CityOfficial[] = [];

    constructor(
        private authService: AuthService,
        private systemSettingsService: SystemSettingsService,
        private router: Router,
        private alertController: AlertController,
        private toastController: ToastController
    ) { }

    ngOnInit() {
        this.loadUserData();
        this.loadSystemSettings();
    }

    ionViewWillEnter() {
        this.loadUserData();
        this.loadSystemSettings();
    }

    loadSystemSettings() {
        this.cityLogo = this.systemSettingsService.getLogo();
        this.cityInfo = this.systemSettingsService.getCityInfo();
        this.visionMission = this.systemSettingsService.getVisionMission();
        this.officials = this.systemSettingsService.getOfficials();
    }

    loadUserData() {
        this.userData = this.authService.getCurrentUser();

        if (this.userData) {
            // Build full name
            this.fullName = `${this.userData.name.givenName} ${this.userData.name.middleInitial ? this.userData.name.middleInitial + '. ' : ''}${this.userData.name.lastName}${this.userData.name.extension ? ' ' + this.userData.name.extension : ''}`.trim();

            // Set contact number
            this.contactNumber = this.userData.mobileNumber || '';
            this.originalContactNumber = this.contactNumber;

            // Build full address
            const addr = this.userData.address;
            const addressParts = [
                addr.houseNo,
                addr.street,
                addr.purok,
                addr.barangay,
                addr.municipality,
                addr.province,
                addr.postalCode
            ].filter(part => part && part.trim() !== '');

            this.fullAddress = addressParts.join(', ');

            // Format member since date
            if (this.userData.dateRegistered) {
                const date = new Date(this.userData.dateRegistered);
                this.memberSince = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
            }
        }
    }

    onContactNumberInput(event: any) {
        let value = event.target.value;

        // Remove all non-numeric characters
        value = value.replace(/[^0-9]/g, '');

        // Limit to 11 digits
        if (value.length > 11) {
            value = value.substring(0, 11);
        }

        // Update the model
        this.contactNumber = value;

        // Update the input value
        event.target.value = value;
    }

    validateContactNumber(): boolean {
        // Check if contact number is exactly 11 digits
        if (this.contactNumber.length !== 11) {
            return false;
        }

        // Check if it starts with "09"
        if (!this.contactNumber.startsWith('09')) {
            return false;
        }

        // Check if it contains only numbers
        if (!/^\d+$/.test(this.contactNumber)) {
            return false;
        }

        return true;
    }

    async saveChanges() {
        if (!this.userData) {
            await this.showToast('No user data found', 'danger');
            return;
        }

        // Validate contact number
        if (!this.validateContactNumber()) {
            let errorMessage = 'Invalid contact number. ';

            if (this.contactNumber.length !== 11) {
                errorMessage += 'Must be exactly 11 digits. ';
            }
            if (!this.contactNumber.startsWith('09')) {
                errorMessage += 'Must start with "09".';
            }

            await this.showToast(errorMessage, 'danger');
            return;
        }

        // Update the mobile number
        this.userData.mobileNumber = this.contactNumber;

        // Update in auth service
        this.authService.updateUser(this.userData);
        this.authService.setCurrentUser(this.userData);

        // Update original contact number and exit edit mode
        this.originalContactNumber = this.contactNumber;
        this.isEditMode = false;

        await this.showToast('Changes saved successfully', 'success');
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
    }

    cancelEdit() {
        // Restore original contact number
        this.contactNumber = this.originalContactNumber;
        this.isEditMode = false;
    }

    // Change Password Methods
    toggleCurrentPasswordVisibility() {
        this.showCurrentPassword = !this.showCurrentPassword;
    }

    toggleNewPasswordVisibility() {
        this.showNewPassword = !this.showNewPassword;
    }

    toggleConfirmPasswordVisibility() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    async updatePassword() {
        // Validate all fields are filled
        if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
            await this.showToast('Please fill in all password fields', 'warning');
            return;
        }

        // Validate current password
        if (!this.userData) {
            await this.showToast('No user data found', 'danger');
            return;
        }

        if (this.userData.password !== this.currentPassword) {
            await this.showToast('Current password is incorrect', 'danger');
            return;
        }

        // Validate new password length
        if (this.newPassword.length < 8) {
            await this.showToast('New password must be at least 8 characters', 'warning');
            return;
        }

        // Validate passwords match
        if (this.newPassword !== this.confirmPassword) {
            await this.showToast('New passwords do not match', 'warning');
            return;
        }

        // Validate new password is different from current
        if (this.currentPassword === this.newPassword) {
            await this.showToast('New password must be different from current password', 'warning');
            return;
        }

        // Update password
        this.userData.password = this.newPassword;
        this.authService.updateUser(this.userData);
        this.authService.setCurrentUser(this.userData);

        // Clear password fields
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

        await this.showToast('Password updated successfully!', 'success');
    }

    async showToast(message: string, color: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: 3000,
            position: 'top',
            color: color
        });
        await toast.present();
    }
}
