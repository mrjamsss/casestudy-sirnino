import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard/dashboard.page';

import { AdminLayoutPage } from './layout/admin-layout.page';

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
        path: 'residents',
        loadChildren: () => import('./resident-management/resident-management.module').then(m => m.ResidentManagementPageModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementPageModule)
      },
      {
        path: 'requests',
        loadChildren: () => import('./request-management/request-management.module').then(m => m.RequestManagementPageModule)
      },
      {
        path: 'departments',
        loadChildren: () => import('./department-info/department-info.module').then(m => m.DepartmentInfoPageModule)
      },
      {
        path: 'fee-settings',
        loadChildren: () => import('./fee-calculator-settings/fee-calculator-settings.module').then(m => m.FeeCalculatorSettingsPageModule)
      },
      {
        path: 'announcements',
        loadChildren: () => import('./announcements/announcements.module').then(m => m.AnnouncementsPageModule)
      },
      {
        path: 'transactions',
        loadChildren: () => import('./transaction-logs/transaction-logs.module').then(m => m.TransactionLogsPageModule)
      },
      {
        path: 'help',
        loadChildren: () => import('./help/help.module').then(m => m.HelpPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./system-settings/system-settings.module').then(m => m.SystemSettingsPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
