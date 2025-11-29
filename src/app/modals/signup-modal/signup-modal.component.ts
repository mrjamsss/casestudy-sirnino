import { Component } from '@angular/core';
import { ModalController, AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserData } from '../../services/auth.service';
import { SignInModalComponent } from '../signin-modal/signin-modal.component';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss']
})
export class SignUpModalComponent {
  currentStep = 1;
  loading = false;
  
  // Date picker properties
  showDatePicker = false;
  formattedDate = '';
  maxDate = new Date().toISOString();
  minDate = new Date(1900, 0, 1).toISOString();
  
  formData: UserData = {
    name: { givenName: '', middleInitial: '', lastName: '', extension: '' },
    address: {
      houseNo: '', street: '', purok: '', barangay: '',
      municipality: 'Cabanatuan City', province: 'Nueva Ecija', postalCode: ''
    },
    idType: 'Philippine National ID (PhilSys ID)',
    idNumber: '',
    dateOfBirth: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    status: 'Pending',
    dateRegistered: ''
  };

  idTypes: string[] = [];

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {
    this.idTypes = this.authService.idTypes;
  }

  // Toggle inline calendar
  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  // Handle date change from calendar
  onDateChange(event: any) {
    const isoDate = event.detail.value;
    this.formData.dateOfBirth = isoDate;
    
    // Format for display (mm/dd/yyyy)
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    this.formattedDate = `${month}/${day}/${year}`;
    
    // Close calendar after selection
    this.showDatePicker = false;
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
      if (!this.formData.name.givenName || !this.formData.name.lastName ||
          !this.formData.idNumber || !this.formData.dateOfBirth) {
        return {
          valid: false,
          message: 'Please fill out all required fields: Given Name, Last Name, ID Number, and Date of Birth.'
        };
      }
    } else if (this.currentStep === 2) {
      if (!this.formData.address.barangay || !this.formData.address.postalCode ||
          !this.formData.mobileNumber) {
        return {
          valid: false,
          message: 'Please complete all required fields: Barangay, Postal Code, and Mobile Number.'
        };
      }
    } else if (this.currentStep === 3) {
      if (!this.formData.email || !this.formData.password || !this.formData.confirmPassword) {
        return {
          valid: false,
          message: 'Email and Password fields are required.'
        };
      }

      if (this.formData.password.length < 6) {
        return {
          valid: false,
          message: 'Password must be at least 6 characters long.'
        };
      }

      if (this.formData.password !== this.formData.confirmPassword) {
        return {
          valid: false,
          message: 'Passwords do not match.'
        };
      }
    }
    return { valid: true };
  }

  async handleSubmit() {
    this.loading = true;
    const result = await this.authService.register(this.formData);
    this.loading = false;

    if (result.success) {
      const alert = await this.alertCtrl.create({
        header: 'Success',
        message: 'Registration completed successfully!',
        buttons: ['OK']
      });
      await alert.present();
      this.modalCtrl.dismiss({ registered: true });
    }
  }

  getFullName(): string {
    const { givenName, middleInitial, lastName, extension } = this.formData.name;
    return `${givenName} ${middleInitial ? middleInitial + '.' : ''} ${lastName} ${extension}`.trim();
  }

  getFullAddress(): string {
    const addr = this.formData.address;
    return `${addr.houseNo} ${addr.street} ${addr.purok}, Brgy. ${addr.barangay}, ${addr.municipality}, ${addr.province}, ${addr.postalCode}`.trim();
  }

  async switchToSignIn() {
  await this.modalCtrl.dismiss();
  const modal = await this.modalCtrl.create({
    component: SignInModalComponent,
    cssClass: 'auth-modal'
  });
  
  // ✅ Set width BEFORE presenting to avoid flash
  modal.style.setProperty('--width', '420px');
  modal.style.setProperty('--max-width', '420px');
  modal.style.setProperty('--height', 'auto');
  
  await modal.present();
}


}
