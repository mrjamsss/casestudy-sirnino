import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransactionLogsPageRoutingModule } from './transaction-logs-routing.module';
import { TransactionLogsPage } from './transaction-logs.page';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionLogsPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [TransactionLogsPage]
})
export class TransactionLogsPageModule {}
