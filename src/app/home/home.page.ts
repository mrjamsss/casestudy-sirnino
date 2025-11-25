import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { SignUpModalComponent } from '../modals/signup-modal/signup-modal.component';
import { SignInModalComponent } from '../modals/signin-modal/signin-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  activeSection = 'home'; // Track active section

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  async openSignIn() {
  const modal = await this.modalCtrl.create({
    component: SignInModalComponent,
    cssClass: 'auth-modal',
    mode: 'ios',
    initialBreakpoint: undefined,
    breakpoints: undefined,
  });
  
  // ✅ Modal itself is the element - no getElement() needed
  modal.style.setProperty('--width', '420px');
  modal.style.setProperty('--max-width', '420px');
  modal.style.setProperty('--height', 'auto');
  
  await modal.present();
  return modal;
}

async openSignUp() {
  const modal = await this.modalCtrl.create({
    component: SignUpModalComponent,
    cssClass: 'auth-modal signup-modal',
    mode: 'ios',
    initialBreakpoint: undefined,
    breakpoints: undefined,
  });
  
  // ✅ Modal itself is the element
  modal.style.setProperty('--width', '480px');
  modal.style.setProperty('--max-width', '480px');
  modal.style.setProperty('--height', 'auto');
  
  await modal.present();
  return modal;
}




  scrollToSection(sectionId: string) {
    this.activeSection = sectionId; // Update active section
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  // Add this function for your buttons
  scrollToFeatures() {
    this.scrollToSection('features');
  }
}
