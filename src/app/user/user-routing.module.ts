import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard/dashboard.page';
import { UserLayoutPage } from './layout/user-layout.page';

import { RequestDocumentPage } from './request-document/request-document.page';
import { FeeCalculatorPage } from './fee-calculator/fee-calculator.page';
import { ServiceRequirementsPage } from './service-requirements/service-requirements.page';
import { AnnouncementsPage } from './announcements/announcement.page';
import { TransactionLogsPage } from './transaction-logs/transaction-logs.page';
import { HelpPage } from './help/help.page';
import { AccountSettingsPage } from './account-settings/account-settings.page';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutPage,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardPage
      },
      {
        path: 'request-document',
        component: RequestDocumentPage
      },
      {
        path: 'fee-calculator',
        component: FeeCalculatorPage
      },
      {
        path: 'service-requirements',
        component: ServiceRequirementsPage
      },
      {
        path: 'announcements',
        component: AnnouncementsPage
      },
      {
        path: 'transaction-logs',
        component: TransactionLogsPage
      },
      {
        path: 'help',
        component: HelpPage
      },
      {
        path: 'account-settings',
        component: AccountSettingsPage
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
