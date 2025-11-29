import { Component } from '@angular/core';
import { ModalController, AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginData } from '../../services/auth.service';
import { SignUpModalComponent } from '../signup-modal/signup-modal.component';

@Component({
  selector: 'app-signin-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './signin-modal.component.html',
  styleUrls: ['./signin-modal.component.scss']
})
export class SignInModalComponent {
  loginData: LoginData = {
    email: '',
    password: '',
    role: 'user'
  };

  loading = false;
  showPassword = false;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async handleSignIn() {
    if (!this.loginData.email || !this.loginData.password) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Please enter both email and password.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.loading = true;
    const result = await this.authService.login(this.loginData);
    this.loading = false;

    if (result.success) {
      // Close the modal first
      await this.modalCtrl.dismiss({ loggedIn: true });

      // Navigate based on role
      if (this.loginData.role === 'admin') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/citizen-portal/dashboard']);
      }

      // Show success message
      const alert = await this.alertCtrl.create({
        header: 'Success',
        message: 'Sign in successful!',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: result.message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async switchToSignUp() {
    await this.modalCtrl.dismiss();
    const modal = await this.modalCtrl.create({
      component: SignUpModalComponent,
      cssClass: 'auth-modal signup-modal'
    });

    // Set width BEFORE presenting
    modal.style.setProperty('--width', '480px');
    modal.style.setProperty('--max-width', '480px');
    modal.style.setProperty('--height', 'auto');

    await modal.present();
  }

  async handleForgotPassword() {
    const alert = await this.alertCtrl.create({
      cssClass: 'reset-password-alert',
      header: 'Reset Password',
      message: 'Enter your email address to receive a password reset link.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'your@email.com',
          value: this.loginData.email || ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send Reset Link',
          handler: async (data) => {
            if (!data.email) {
              this.showAlert('Error', 'Please enter your email address.');
              return false;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
              this.showAlert('Error', 'Please enter a valid email address.');
              return false;
            }

            // Use auth service to send reset email
            await this.sendPasswordResetEmail(data.email);
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async sendPasswordResetEmail(email: string) {
    const result = await this.authService.resetPassword(email);
    if (result.success) {
      const alert = await this.alertCtrl.create({
        cssClass: 'success-alert',
        header: 'Check Your Email',
        message: `A password reset link has been sent to ${email}. Please check your inbox and follow the instructions.`,
        buttons: ['OK']
      });
      await alert.present();
    } else {
      const alert = await this.alertCtrl.create({
        cssClass: 'error-alert',
        header: 'Error',
        message: result.message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
