import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard/dashboard.page';
import { AdminLayoutPage } from './layout/admin-layout.page';
import { ResidentManagementPage } from './resident-management/resident-management.page';
import { UserManagementPage } from './user-management/user-management.page';
import { RequestManagementPage } from './request-management/request-management.page';
import { DepartmentInfoPage } from './department-info/department-info.page';
import { FeeCalculatorSettingsPage } from './fee-calculator-settings/fee-calculator-settings.page';
import { AnnouncementsPage } from './announcements/announcements.page';
import { TransactionLogsPage } from './transaction-logs/transaction-logs.page';
import { HelpPage } from './help/help.page';
import { SystemSettingsPage } from './system-settings/system-settings.page';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutPage,
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
        path: 'resident-management',
        component: ResidentManagementPage
      },
      {
        path: 'user-management',
        component: UserManagementPage
      },
      {
        path: 'request-management',
        component: RequestManagementPage
      },
      {
        path: 'department-info',
        component: DepartmentInfoPage
      },
      {
        path: 'fee-calculator-settings',
        component: FeeCalculatorSettingsPage
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
        path: 'system-settings',
        component: SystemSettingsPage
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
