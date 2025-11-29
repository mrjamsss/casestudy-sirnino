import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FeeCalculatorSettingsPageRoutingModule } from './fee-calculator-settings-routing.module';
import { FeeCalculatorSettingsPage } from './fee-calculator-settings.page';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeeCalculatorSettingsPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [FeeCalculatorSettingsPage]
})
export class FeeCalculatorSettingsPageModule {}
