import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResidentManagementPage } from './resident-management.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentManagementPageRoutingModule {}
