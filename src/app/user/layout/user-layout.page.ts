import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../shared/services/sidebar.service';

@Component({
    selector: 'app-user-layout',
    templateUrl: './user-layout.page.html',
    styleUrls: ['./user-layout.page.scss'],
    standalone: false
})
export class UserLayoutPage implements OnInit {
    isCollapsed = false;

    constructor(private sidebarService: SidebarService) { }

    ngOnInit() {
        this.sidebarService.isCollapsed$.subscribe(collapsed => {
            this.isCollapsed = collapsed;
        });
    }

    toggleSidebar() {
        this.sidebarService.toggleSidebar();
    }

    closeSidebar() {
        this.sidebarService.setSidebarState(true);
    }
}
