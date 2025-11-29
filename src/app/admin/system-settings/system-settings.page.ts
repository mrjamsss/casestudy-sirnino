import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { OfficialModalComponent } from './official-modal/official-modal.component';

interface BarangayOfficial {
    id?: string;
    name: string;
    position: string;
    picture?: string;
    order?: number;
}

@Component({
    selector: 'app-system-settings',
    templateUrl: './system-settings.page.html',
    styleUrls: ['./system-settings.page.scss'],
    standalone: false
})
export class SystemSettingsPage implements OnInit {
    // Forms
    barangayInfoForm!: FormGroup;
    visionMissionForm!: FormGroup;
    passwordForm!: FormGroup;

    // Officials
    officials: BarangayOfficial[] = [];
    loadingOfficials = false;

    // Logo
    uploadedLogo: string | null = null;

    // Password visibility toggles
    showCurrentPassword = false;
    showNewPassword = false;
    showConfirmPassword = false;
    passwordStrength = 0;

    constructor(
        private fb: FormBuilder,
        private alertController: AlertController,
        private toastController: ToastController,
        private modalController: ModalController
    ) { }

    ngOnInit() {
        this.initializeForms();
        this.loadOfficials();
        this.loadBarangayInfo();
        this.loadVisionMission();
        this.loadLogo();
    }

    initializeForms() {
        // Barangay Info Form
        this.barangayInfoForm = this.fb.group({
            name: ['Cabanatuan City Hall', Validators.required],
            captain: ['', Validators.required],
            address: ['', Validators.required],
            contact: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
        });

        // Vision & Mission Form
        this.visionMissionForm = this.fb.group({
            vision: ['', Validators.required],
            mission: ['', Validators.required],
        });

        // Password Form
        this.passwordForm = this.fb.group(
            {
                currentPassword: ['', Validators.required],
                newPassword: ['', [Validators.required, Validators.minLength(8)]],
                confirmPassword: ['', Validators.required],
            },
            { validators: this.passwordMatchValidator }
        );
    }

    passwordMatchValidator(group: FormGroup) {
        const newPassword = group.get('newPassword')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        if (newPassword !== confirmPassword) {
            group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
        } else {
            const errors = group.get('confirmPassword')?.errors;
            if (errors && errors['passwordMismatch']) {
                delete errors['passwordMismatch'];
                group
                    .get('confirmPassword')
                    ?.setErrors(Object.keys(errors).length ? errors : null);
            }
        }
        return null;
    }

    // Officials Management
    loadOfficials() {
        this.loadingOfficials = true;
        // Simulate loading from storage
        setTimeout(() => {
            const stored = localStorage.getItem('cityHallOfficials');
            if (stored) {
                this.officials = JSON.parse(stored);
            } else {
                this.officials = [];
            }
            this.loadingOfficials = false;
        }, 500);
    }

    async addOfficial() {
        const modal = await this.modalController.create({
            component: OfficialModalComponent
        });

        await modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm' && data) {
            const newOfficial: BarangayOfficial = {
                id: Date.now().toString(),
                name: data.name,
                position: data.position,
                picture: data.picture,
                order: this.officials.length,
            };
            this.officials.push(newOfficial);
            this.saveOfficials();
            await this.showToast('Official added successfully', 'success');
        }
    }

    async editOfficial(official: BarangayOfficial) {
        const modal = await this.modalController.create({
            component: OfficialModalComponent,
            componentProps: {
                official: official
            }
        });

        await modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm' && data) {
            official.name = data.name;
            official.position = data.position;
            official.picture = data.picture;
            this.saveOfficials();
            await this.showToast('Official updated successfully', 'success');
        }
    }

    async deleteOfficial(official: BarangayOfficial) {
        const alert = await this.alertController.create({
            header: 'Delete Official',
            message: `Are you sure you want to delete ${official.name}?`,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: async () => {
                        this.officials = this.officials.filter((o) => o.id !== official.id);
                        this.saveOfficials();
                        await this.showToast('Official deleted successfully', 'success');
                    },
                },
            ],
        });

        await alert.present();
    }

    dropOfficial(event: CdkDragDrop<BarangayOfficial[]>) {
        moveItemInArray(this.officials, event.previousIndex, event.currentIndex);
        this.officials.forEach((official, index) => {
            official.order = index;
        });
        this.saveOfficials();
    }

    saveOfficials() {
        localStorage.setItem('cityHallOfficials', JSON.stringify(this.officials));
    }

    // Barangay Info
    loadBarangayInfo() {
        const stored = localStorage.getItem('cityHallInfo');
        if (stored) {
            this.barangayInfoForm.patchValue(JSON.parse(stored));
        }
    }

    async saveBarangayInfo() {
        if (this.barangayInfoForm.valid) {
            localStorage.setItem(
                'cityHallInfo',
                JSON.stringify(this.barangayInfoForm.value)
            );
            await this.showToast('City Hall information saved', 'success');
        } else {
            await this.showToast('Please fill all required fields', 'danger');
        }
    }

    // Vision & Mission
    loadVisionMission() {
        const stored = localStorage.getItem('visionMission');
        if (stored) {
            this.visionMissionForm.patchValue(JSON.parse(stored));
        }
    }

    async saveVisionMission() {
        if (this.visionMissionForm.valid) {
            localStorage.setItem(
                'visionMission',
                JSON.stringify(this.visionMissionForm.value)
            );
            await this.showToast('Vision & Mission saved', 'success');
        } else {
            await this.showToast('Please fill all required fields', 'danger');
        }
    }

    // Logo Upload
    loadLogo() {
        const stored = localStorage.getItem('cityHallLogo');
        if (stored) {
            this.uploadedLogo = stored;
        }
    }

    async onLogoSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                await this.showToast('Only JPG and PNG files are allowed', 'danger');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                await this.showToast('File size must be less than 5MB', 'danger');
                return;
            }

            // Read and store the file
            const reader = new FileReader();
            reader.onload = async (e: any) => {
                this.uploadedLogo = e.target.result;
                localStorage.setItem('cityHallLogo', this.uploadedLogo!);
                await this.showToast('Logo uploaded successfully', 'success');
            };
            reader.readAsDataURL(file);
        }
    }

    // Password Management
    togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
        switch (field) {
            case 'current':
                this.showCurrentPassword = !this.showCurrentPassword;
                break;
            case 'new':
                this.showNewPassword = !this.showNewPassword;
                break;
            case 'confirm':
                this.showConfirmPassword = !this.showConfirmPassword;
                break;
        }
    }

    onPasswordInput(password: string) {
        // Calculate password strength
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (password.length >= 12) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 12.5;
        if (/[^a-zA-Z\d]/.test(password)) strength += 12.5;

        this.passwordStrength = Math.min(strength, 100);
    }

    getPasswordStrengthColor(): string {
        if (this.passwordStrength < 40) return 'weak';
        if (this.passwordStrength < 70) return 'medium';
        return 'strong';
    }

    getPasswordStrengthText(): string {
        if (this.passwordStrength < 40) return 'Weak password';
        if (this.passwordStrength < 70) return 'Medium password';
        return 'Strong password';
    }

    async updatePassword() {
        if (this.passwordForm.valid) {
            // In a real app, you would verify the current password and update it
            const currentPassword = this.passwordForm.get('currentPassword')?.value;
            const newPassword = this.passwordForm.get('newPassword')?.value;

            // Simulate password update
            await this.showToast('Password updated successfully', 'success');
            this.passwordForm.reset();
            this.passwordStrength = 0;
        } else {
            await this.showToast('Please fill all required fields correctly', 'danger');
        }
    }

    // Helper Methods
    async showToast(message: string, color: 'success' | 'danger' | 'warning') {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
            color,
            position: 'top',
        });
        await toast.present();
    }
}
