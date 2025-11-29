import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestDocumentPage } from './request-document.page';

const routes: Routes = [
  {
    path: '',
    component: RequestDocumentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestDocumentPageRoutingModule {}
