import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { SignUpModalComponent } from '../modals/signup-modal/signup-modal.component';
import { SignInModalComponent } from '../modals/signin-modal/signin-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SignUpModalComponent,
    SignInModalComponent
  ],
  declarations: [
    HomePage
  ]
})
export class HomePageModule {}
