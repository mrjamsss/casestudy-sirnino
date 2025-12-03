import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

interface CityInfoData {
    name: string;
    mayor: string;
    address: string;
    contact: string;
    vision: string;
    mission: string;
    logo: string | null;
}

@Component({
    selector: 'app-city-info-modal',
    templateUrl: './city-info-modal.component.html',
    styleUrls: ['./city-info-modal.component.scss'],
    standalone: false
})
export class CityInfoModalComponent implements OnInit {
    @Input() initialData?: CityInfoData;
    @Input() startStep?: number;

    currentStep = 1;
    loading = false;

    formData: CityInfoData = {
        name: '',
        mayor: '',
        address: '',
        contact: '',
        vision: '',
        mission: '',
        logo: null
    };

    constructor(
        private modalCtrl: ModalController,
        private alertCtrl: AlertController
    ) { }

    ngOnInit() {
        // If initial data is provided, populate the form
        if (this.initialData) {
            this.formData = { ...this.initialData };
        }

        // If start step is provided, navigate to that step
        if (this.startStep) {
            this.currentStep = this.startStep;
        }
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }

    async nextStep() {
        const validationResult = this.validateCurrentStep();
        if (!validationResult.valid) {
            const alert = await this.alertCtrl.create({
                header: 'Validation Error',
                message: validationResult.message,
                buttons: ['OK']
            });
            await alert.present();
            return;
        }

        if (this.currentStep < 4) {
            this.currentStep++;
        } else {
            await this.handleSubmit();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    validateCurrentStep(): { valid: boolean; message?: string } {
        if (this.currentStep === 1) {
            if (!this.formData.name || !this.formData.mayor || !this.formData.address || !this.formData.contact) {
                return {
                    valid: false,
                    message: 'Please fill out all required fields: City Name, Mayor, Address, and Contact Number.'
                };
            }

            // Validate phone number format
            const phoneRegex = /^09\d{9}$/;
            if (!phoneRegex.test(this.formData.contact)) {
                return {
                    valid: false,
                    message: 'Contact number must be in format 09XXXXXXXXX (11 digits).'
                };
            }
        } else if (this.currentStep === 2) {
            if (!this.formData.vision || !this.formData.mission) {
                return {
                    valid: false,
                    message: 'Please fill out both Vision and Mission statements.'
                };
            }
        } else if (this.currentStep === 3) {
            if (!this.formData.logo) {
                return {
                    valid: false,
                    message: 'Please upload a city logo.'
                };
            }
        }
        return { valid: true };
    }

    async onLogoSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                const alert = await this.alertCtrl.create({
                    header: 'Invalid File Type',
                    message: 'Only JPG and PNG files are allowed',
                    buttons: ['OK']
                });
                await alert.present();
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                const alert = await this.alertCtrl.create({
                    header: 'File Too Large',
                    message: 'File size must be less than 5MB',
                    buttons: ['OK']
                });
                await alert.present();
                return;
            }

            // Read and store the file
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.formData.logo = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    async handleSubmit() {
        this.loading = true;

        // Simulate saving
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.loading = false;

        // Close modal and pass data back
        await this.modalCtrl.dismiss(this.formData, 'confirm');
    }

    goToStep(step: number) {
        if (step < this.currentStep) {
            this.currentStep = step;
        }
    }
}
