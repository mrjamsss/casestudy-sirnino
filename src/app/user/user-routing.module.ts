import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard/dashboard.page';

import { UserLayoutPage } from './layout/user-layout.page';

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
        loadChildren: () => import('./request-document/request-document.module').then(m => m.RequestDocumentPageModule)
      },
      {
        path: 'service-requirements',
        loadChildren: () => import('./service-requirements/service-requirements.module').then(m => m.ServiceRequirementsPageModule)
      },
      {
        path: 'fee-calculator',
        loadChildren: () => import('./fee-calculator/fee-calculator.module').then(m => m.FeeCalculatorPageModule)
      },
      {
        path: 'announcements',
        loadChildren: () => import('./announcements/announcements.module').then(m => m.AnnouncementsPageModule)
      },
      {
        path: 'transaction-logs',
        loadChildren: () => import('./transaction-logs/transaction-logs.module').then(m => m.TransactionLogsPageModule)
      },
      {
        path: 'help',
        loadChildren: () => import('./help/help.module').then(m => m.HelpPageModule)
      },
      {
        path: 'account-settings',
        loadChildren: () => import('./account-settings/account-settings.module').then(m => m.AccountSettingsPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
