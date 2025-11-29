import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardPage } from './dashboard/dashboard.page';
import { SharedComponentsModule } from '../shared/components/shared-components.module';
import { AdminLayoutPage } from './layout/admin-layout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminRoutingModule,
    SharedComponentsModule
  ],
  declarations: [DashboardPage, AdminLayoutPage]
})
export class AdminModule {}
