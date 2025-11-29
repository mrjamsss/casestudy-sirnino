import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UserMenuComponent } from 'src/app/shared/components/user-menu/user-menu.component';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: UserMenuComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
}
