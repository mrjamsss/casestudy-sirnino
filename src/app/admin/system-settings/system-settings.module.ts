import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { IonicModule } from '@ionic/angular';

import { SystemSettingsPageRoutingModule } from './system-settings-routing.module';

import { SystemSettingsPage } from './system-settings.page';
import { OfficialModalComponent } from './official-modal/official-modal.component';
import { CityInfoModalComponent } from './city-info-modal/city-info-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DragDropModule,
        IonicModule,
        SystemSettingsPageRoutingModule
    ],
    declarations: [SystemSettingsPage, OfficialModalComponent, CityInfoModalComponent]
})
export class SystemSettingsPageModule { }
