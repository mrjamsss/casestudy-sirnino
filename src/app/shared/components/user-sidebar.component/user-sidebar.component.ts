import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';

interface MenuItem {
    label: string;
    icon: string;
    route: string;
    isLogout?: boolean;
}

@Component({
    selector: 'app-user-sidebar',
    templateUrl: './user-sidebar.component.html',
    styleUrls: ['./user-sidebar.component.scss'],
    standalone: false
})
export class UserSidebarComponent implements OnInit {
    isCollapsed = false;

    menuItems: MenuItem[] = [
        { label: 'Dashboard', icon: 'grid', route: '/citizen-portal/dashboard' },
        { label: 'Request Document', icon: 'document-text', route: '/citizen-portal/request-document' },
        { label: 'Fee Calculator', icon: 'calculator', route: '/citizen-portal/fee-calculator' },
        { label: 'Service Requirements', icon: 'list-circle', route: '/citizen-portal/service-requirements' },
        { label: 'Announcements', icon: 'megaphone', route: '/citizen-portal/announcements' },
        { label: 'Transaction Logs', icon: 'receipt', route: '/citizen-portal/transaction-logs' },
        { label: 'Help', icon: 'help-circle', route: '/citizen-portal/help' },
        { label: 'Account Settings', icon: 'settings', route: '/citizen-portal/account-settings' },
        { label: 'Logout', icon: 'log-out', route: '/home', isLogout: true }
    ];

    constructor(
        private router: Router,
        private sidebarService: SidebarService
    ) { }

    ngOnInit() {
        this.sidebarService.isCollapsed$.subscribe(collapsed => {
            this.isCollapsed = collapsed;
        });
    }

    navigate(item: MenuItem) {
        if (item.isLogout) {
            console.log('Logging out...');
        }
        this.router.navigate([item.route]);
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 576) {
            this.sidebarService.setSidebarState(true); // true means collapsed
        }
    }

    toggleSidebar() {
        this.sidebarService.toggleSidebar();
    }

    isActive(route: string): boolean {
        return this.router.url === route;
    }
}
