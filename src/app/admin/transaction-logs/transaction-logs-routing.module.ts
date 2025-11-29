import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionLogsPage } from './transaction-logs.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionLogsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionLogsPageRoutingModule {}
