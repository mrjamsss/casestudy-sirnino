import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccountSettingsPageRoutingModule } from './account-settings-routing.module';
import { AccountSettingsPage } from './account-settings.page';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountSettingsPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [AccountSettingsPage]
})
export class AccountSettingsPageModule {}
