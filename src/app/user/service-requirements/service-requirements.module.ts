import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ServiceRequirementsPageRoutingModule } from './service-requirements-routing.module';
import { ServiceRequirementsPage } from './service-requirements.page';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceRequirementsPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [ServiceRequirementsPage]
})
export class ServiceRequirementsPageModule {}
