import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { UserRoutingModule } from './user-routing.module';
import { DashboardPage } from './dashboard/dashboard.page';
import { SharedComponentsModule } from '../shared/components/shared-components.module';
import { UserLayoutPage } from './layout/user-layout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserRoutingModule,
    SharedComponentsModule
  ],
  declarations: [DashboardPage, UserLayoutPage]
})
export class UserModule {}
