import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FeeCalculatorPageRoutingModule } from './fee-calculator-routing.module';
import { FeeCalculatorPage } from './fee-calculator.page';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeeCalculatorPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [FeeCalculatorPage]
})
export class FeeCalculatorPageModule {}
