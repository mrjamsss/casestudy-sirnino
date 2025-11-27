import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardPage } from './dashboard/dashboard.page';
import { AdminLayoutPage } from './layout/admin-layout.page';
import { AdminSidebarComponent } from '../shared/components/admin-sidebar.component/admin-sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminRoutingModule
  ],
  declarations: [
    DashboardPage,
    AdminLayoutPage,
    AdminSidebarComponent
  ]
})
export class AdminModule { }
