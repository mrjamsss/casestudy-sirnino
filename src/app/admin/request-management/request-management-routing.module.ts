import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestManagementPage } from './request-management.page';

const routes: Routes = [
  {
    path: '',
    component: RequestManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestManagementPageRoutingModule {}
