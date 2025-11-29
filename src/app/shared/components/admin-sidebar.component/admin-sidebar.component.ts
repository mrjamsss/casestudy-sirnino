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
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  standalone: false
})
export class AdminSidebarComponent implements OnInit {
  isCollapsed = false;

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'grid', route: '/admin/dashboard' },
    { label: 'Resident Management', icon: 'people', route: '/admin/resident-management' },
    { label: 'User Management', icon: 'person', route: '/admin/user-management' },
    { label: 'Request Management', icon: 'document-text', route: '/admin/request-management' },
    { label: 'Department Info', icon: 'business', route: '/admin/department-info' },
    { label: 'Fee Calculator Settings', icon: 'calculator', route: '/admin/fee-calculator-settings' },
    { label: 'Announcements', icon: 'megaphone', route: '/admin/announcements' },
    { label: 'Transaction Logs', icon: 'receipt', route: '/admin/transaction-logs' },
    { label: 'Help', icon: 'help-circle', route: '/admin/help' },
    { label: 'System Settings', icon: 'settings', route: '/admin/system-settings' },
    { label: 'Logout', icon: 'log-out', route: '/auth/login', isLogout: true }
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
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
