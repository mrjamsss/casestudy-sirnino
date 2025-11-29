import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceRequirementsPage } from './service-requirements.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceRequirementsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceRequirementsPageRoutingModule {}
