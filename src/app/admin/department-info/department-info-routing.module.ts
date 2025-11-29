import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentInfoPage } from './department-info.page';

const routes: Routes = [
  {
    path: '',
    component: DepartmentInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentInfoPageRoutingModule {}
