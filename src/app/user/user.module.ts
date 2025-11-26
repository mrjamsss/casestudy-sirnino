import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { UserRoutingModule } from './user-routing.module';
import { DashboardPage } from './dashboard/dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserRoutingModule
  ],
  declarations: [DashboardPage]
})
export class UserModule {}
