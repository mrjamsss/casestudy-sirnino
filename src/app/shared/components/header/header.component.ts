import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, MenuController } from '@ionic/angular';
import { SidebarService } from '../../services/sidebar.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() showUserMenu: boolean = false;

  constructor(
    private router: Router,
    private popoverCtrl: PopoverController,
    private sidebarService: SidebarService,
    private menuCtrl: MenuController
  ) {}

  toggleSidebar() {
    // Check if we are on mobile or desktop to decide behavior?
    // Actually, if we just toggle the service, the split pane 'when' condition will handle the layout.
    // But on mobile, we usually just want to open the menu, not toggle the split pane logic.
    // Let's check window width or use a platform utility.
    const isMobile = window.innerWidth < 992; // 992px is default 'lg' breakpoint in Ionic

    if (isMobile) {
      this.menuCtrl.toggle();
    } else {
      this.sidebarService.toggleSidebar();
    }
  }

  async presentUserMenu(ev: any) {
    if (this.showUserMenu) {
      // Import UserMenuComponent dynamically if needed
      const { UserMenuComponent } = await import('../user-menu/user-menu.component');
      const popover = await this.popoverCtrl.create({
        component: UserMenuComponent,
        event: ev,
        translucent: true
      });
      return await popover.present();
    }
  }
}

