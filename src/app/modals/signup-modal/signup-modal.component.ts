import { Component } from '@angular/core';
import { ModalController, AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  showPassword = false;
  showConfirmPassword = false;

  // Date picker properties
  showDatePicker = false;
  formattedDate = '';
  maxDate = new Date().toISOString();
  minDate = new Date(1900, 0, 1).toISOString();

  formData: UserData = {
    name: { givenName: '', middleInitial: '', lastName: '', extension: '' },
    address: {
      houseNo: '', street: '', purok: '', barangay: '',
      municipality: 'Cabanatuan City', province: 'Nueva Ecija', postalCode: '3100'
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

  // Barangay Data
  barangays = [
    'Aduas Centro', 'Aduas Norte', 'Aduas Sur', 'Bagong Buhay', 'Bagong Sikat', 'Bakero', 'Bakod Bayan', 'Balite', 'Bangad',
    'Bantug Bulalo', 'Bantug Norte', 'Barlis', 'Barrera District (Poblacion)', 'Bernardo District (Poblacion)', 'Bitas',
    'Bonifacio District (Poblacion)', 'Buliran', 'Caalibangbangan', 'Cabu', 'Calawagan (Kalawagan)', 'Campo Tinio', 'Caridad',
    'Caudillo', 'Cinco-Cinco', 'City Supermarket (Poblacion)', 'Communal', 'Cruz Roja', 'Daang Sarile', 'Dalampang',
    'Dicarma (Poblacion)', 'Dimasalang (Poblacion)', 'Dionisio S. Garcia', 'Fatima (Poblacion)', 'General Luna (Poblacion)',
    'Hermogenes C. Concepcion, Sr.', 'Ibabao Bana', 'Imelda District', 'Isla (Poblacion)', 'Kalikid Norte', 'Kalikid Sur',
    'Kapitan Pepe (Poblacion)', 'Lagare', 'Lourdes (Matungal-tungal)', 'M. S. Garcia', 'Mabini Extension', 'Mabini Homesite',
    'Macatbong', 'Magsaysay District', 'Magsaysay Norte', 'Magsaysay South', 'Maria Theresa', 'Matadero (Poblacion)',
    'Mayapyap Norte', 'Mayapyap Sur', 'Melojavilla (Poblacion)', 'Nabao (Poblacion)', 'Obrero', 'Padre Burgos (Poblacion)',
    'Padre Crisostomo', 'Pagas', 'Palagay', 'Pamaldan', 'Pangatian', 'Patalac', 'Polilio', 'Pula', 'Quezon District (Poblacion)',
    'Rizdelis (Poblacion)', 'Samon', 'San Isidro', 'San Josef Norte', 'San Josef Sur', 'San Juan Pob. (Accfa)', 'San Roque Norte',
    'San Roque Sur', 'Sanbermicristi (Poblacion)', 'Sangitan', 'Sangitan East', 'Sapang', 'Santa Arcadia', 'Santo Niño',
    'Sumacab Este', 'Sumacab Norte', 'Sumacab South', 'Talipapa', 'Valdefuente', 'Valle Cruz', 'Vijandre District (Poblacion)',
    'Villa Ofelia-Caridad', 'Zulueta District (Poblacion)'
  ];
  filteredBarangays: string[] = [];
  showBarangayList = false;

  idTypes: string[] = [];

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
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

  // Phone number validation - only allow numbers, max 11 digits
  onPhoneInput(event: any) {
    let value = event.target.value;
    // Remove all non-digit characters
    value = value.replace(/\D/g, '');
    // Limit to 11 digits
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    this.formData.mobileNumber = value;
    event.target.value = value;
  }

  // Barangay Autocomplete
  filterBarangays(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredBarangays = this.barangays.filter(b => b.toLowerCase().includes(query));
  }

  selectBarangay(barangay: string) {
    this.formData.address.barangay = barangay;
    this.showBarangayList = false;
  }

  isMouseOverBarangayList = false;

  onBarangayFocus() {
    this.showBarangayList = true;
    // Reset filter if empty
    if (!this.formData.address.barangay) {
      this.filteredBarangays = [...this.barangays];
    } else {
      // Filter based on current value
      this.filteredBarangays = this.barangays.filter(b => b.toLowerCase().includes(this.formData.address.barangay.toLowerCase()));
    }
  }

  onBarangayBlur() {
    // Delay hiding to allow click event to register
    setTimeout(() => {
      if (!this.isMouseOverBarangayList) {
        this.showBarangayList = false;
      }
    }, 200);
  }

  onMouseEnterBarangayList() {
    this.isMouseOverBarangayList = true;
  }

  onMouseLeaveBarangayList() {
    this.isMouseOverBarangayList = false;
  // List of ID types that should only accept numbers
  numericIdTypes = [
    'Philippine National ID (PhilSys ID)',
    'SSS ID',
    'GSIS ID',
    'Unified Multi-Purpose ID (UMID)',
    'TIN ID',
    'PhilHealth ID',
    'Postal ID'
  ];

  // Handle ID number input based on ID type
  onIdNumberInput(event: any) {
    const idType = this.formData.idType;
    let value = event.target.value;

    // If the selected ID type is numeric, remove non-digit characters
    if (this.numericIdTypes.includes(idType)) {
      const numericValue = value.replace(/\D/g, '');

      // Only update if the value actually changed (to avoid cursor jumping issues if possible)
      if (value !== numericValue) {
        value = numericValue;
        event.target.value = value;
        this.formData.idNumber = value;
      }
    }
  }

  // House number validation - only allow numbers
  onHouseNoInput(event: any) {
    let value = event.target.value;
    // Remove all non-digit characters
    value = value.replace(/\D/g, '');
    this.formData.address.houseNo = value;
    event.target.value = value;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
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
      if (!this.formData.address.barangay || !this.formData.mobileNumber) {
        return {
          valid: false,
          message: 'Please complete all required fields: Barangay and Mobile Number.'
        };
      }

      // Validate phone number format
      if (this.formData.mobileNumber.length !== 11) {
        return {
          valid: false,
          message: 'Mobile number must be exactly 11 digits.'
        };
      }

      if (!this.formData.mobileNumber.startsWith('09')) {
        return {
          valid: false,
          message: 'Mobile number must start with 09.'
        };
      }
    } else if (this.currentStep === 3) {
      if (!this.formData.email || !this.formData.password || !this.formData.confirmPassword) {
        return {
          valid: false,
          message: 'Email and Password fields are required.'
        };
      }

      // Validate Gmail address
      if (!this.formData.email.toLowerCase().endsWith('@gmail.com')) {
        return {
          valid: false,
          message: 'Please use a valid Gmail address (@gmail.com).'
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
      // Show success message with approval requirement
      const alert = await this.alertCtrl.create({
        header: 'Registration Successful!',
        message: result.message || 'Your account has been created and is pending admin approval. You will be able to log in once your account is approved.',
        buttons: ['OK']
      });
      await alert.present();

      // Close modal after user acknowledges
      await this.modalCtrl.dismiss({ registered: true });
    } else {
      // Show error message if registration failed
      const alert = await this.alertCtrl.create({
        header: 'Registration Failed',
        message: result.message || 'An error occurred during registration. Please try again.',
        buttons: ['OK']
      });
      await alert.present();
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
