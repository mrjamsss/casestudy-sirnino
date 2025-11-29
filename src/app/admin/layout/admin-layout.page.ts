import { Component } from '@angular/core';
import { SidebarService } from '../../shared/services/sidebar.service';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.page.html',
    styleUrls: ['./admin-layout.page.scss'],
    standalone: false
})
export class AdminLayoutPage {
    constructor(private sidebarService: SidebarService) { }

    toggleSidebar() {
        this.sidebarService.toggleSidebar();
    }
}
