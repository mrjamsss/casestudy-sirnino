import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AdminSidebarComponent } from './admin-sidebar.component/admin-sidebar.component';
import { UserSidebarComponent } from './user-sidebar.component/user-sidebar.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AdminSidebarComponent,
    UserSidebarComponent,
    UserMenuComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [
    AdminSidebarComponent,
    UserSidebarComponent,
    UserMenuComponent,
    HeaderComponent
  ]
})
export class SharedComponentsModule {}
