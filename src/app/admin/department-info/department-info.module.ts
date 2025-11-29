import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DepartmentInfoPageRoutingModule } from './department-info-routing.module';
import { DepartmentInfoPage } from './department-info.page';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DepartmentInfoPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [DepartmentInfoPage]
})
export class DepartmentInfoPageModule {}
