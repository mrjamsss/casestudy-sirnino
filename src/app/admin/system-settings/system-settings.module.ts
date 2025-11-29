import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SystemSettingsPageRoutingModule } from './system-settings-routing.module';
import { SystemSettingsPage } from './system-settings.page';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SystemSettingsPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [SystemSettingsPage]
})
export class SystemSettingsPageModule {}
