import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  standalone: false
})
export class UserMenuComponent implements OnInit {

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {}

  close() {
    this.popoverCtrl.dismiss();
  }

  logout() {
    this.popoverCtrl.dismiss('logout');
  }
}
