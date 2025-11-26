import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CitizenPortalPage } from './citizen-portal.page';

import { CitizenPortalPageRoutingModule } from './citizen-portal-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CitizenPortalPageRoutingModule
  ],
  declarations: [CitizenPortalPage]
})
export class CitizenPortalPageModule {}

