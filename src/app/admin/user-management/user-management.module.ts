import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserManagementPageRoutingModule } from './user-management-routing.module';
import { UserManagementPage } from './user-management.page';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserManagementPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [UserManagementPage]
})
export class UserManagementPageModule {}
