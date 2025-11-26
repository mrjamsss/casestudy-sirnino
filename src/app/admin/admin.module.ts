import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardPage } from './dashboard/dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminRoutingModule
  ],
  declarations: [DashboardPage]
})
export class AdminModule {}
