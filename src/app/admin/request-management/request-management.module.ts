import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RequestManagementPageRoutingModule } from './request-management-routing.module';
import { RequestManagementPage } from './request-management.page';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestManagementPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [RequestManagementPage]
})
export class RequestManagementPageModule {}
