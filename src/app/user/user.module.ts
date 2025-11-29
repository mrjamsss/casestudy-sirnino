import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { UserRoutingModule } from './user-routing.module';
import { DashboardPage } from './dashboard/dashboard.page';
import { UserLayoutPage } from './layout/user-layout.page';
import { UserSidebarComponent } from '../shared/components/user-sidebar.component/user-sidebar.component';
import { RequestDocumentPage } from './request-document/request-document.page';
import { FeeCalculatorPage } from './fee-calculator/fee-calculator.page';
import { ServiceRequirementsPage } from './service-requirements/service-requirements.page';
import { AnnouncementsPage } from './announcements/announcement.page';
import { TransactionLogsPage } from './transaction-logs/transaction-logs.page';
import { HelpPage } from './help/help.page';
import { AccountSettingsPage } from './account-settings/account-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserRoutingModule
  ],
  declarations: [
    DashboardPage,
    UserLayoutPage,
    UserSidebarComponent,
    RequestDocumentPage,
    FeeCalculatorPage,
    ServiceRequirementsPage,
    AnnouncementsPage,
    TransactionLogsPage,
    HelpPage,
    AccountSettingsPage
  ]
})
export class UserModule { }
