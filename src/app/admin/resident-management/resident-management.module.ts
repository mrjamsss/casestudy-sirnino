import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResidentManagementPageRoutingModule } from './resident-management-routing.module';
import { ResidentManagementPage } from './resident-management.page';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentManagementPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [ResidentManagementPage]
})
export class ResidentManagementPageModule {}
