import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AnnouncementsPageRoutingModule } from './announcements-routing.module';
import { AnnouncementsPage } from './announcements.page';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnnouncementsPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [AnnouncementsPage]
})
export class AnnouncementsPageModule {}
