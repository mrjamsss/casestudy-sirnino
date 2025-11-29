import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardPage } from './dashboard/dashboard.page';
import { AdminLayoutPage } from './layout/admin-layout.page';
import { AdminSidebarComponent } from '../shared/components/admin-sidebar.component/admin-sidebar.component';
import { ResidentManagementPage } from './resident-management/resident-management.page';
import { UserManagementPage } from './user-management/user-management.page';
import { RequestManagementPage } from './request-management/request-management.page';
import { DepartmentInfoPage } from './department-info/department-info.page';
import { FeeCalculatorSettingsPage } from './fee-calculator-settings/fee-calculator-settings.page';
import { AnnouncementsPage } from './announcements/announcements.page';
import { TransactionLogsPage } from './transaction-logs/transaction-logs.page';
import { HelpPage } from './help/help.page';
import { SystemSettingsPage } from './system-settings/system-settings.page';

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
    AdminSidebarComponent,
    ResidentManagementPage,
    UserManagementPage,
    RequestManagementPage,
    DepartmentInfoPage,
    FeeCalculatorSettingsPage,
    AnnouncementsPage,
    TransactionLogsPage,
    HelpPage,
    SystemSettingsPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule { }
