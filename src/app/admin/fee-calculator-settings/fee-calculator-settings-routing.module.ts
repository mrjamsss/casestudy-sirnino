import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeeCalculatorSettingsPage } from './fee-calculator-settings.page';

const routes: Routes = [
  {
    path: '',
    component: FeeCalculatorSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeeCalculatorSettingsPageRoutingModule {}
