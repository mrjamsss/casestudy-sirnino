import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RequestDocumentPageRoutingModule } from './request-document-routing.module';
import { RequestDocumentPage } from './request-document.page';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestDocumentPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [RequestDocumentPage]
})
export class RequestDocumentPageModule {}
