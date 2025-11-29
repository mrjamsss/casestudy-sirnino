import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  standalone: false
})
export class AdminSidebarComponent implements OnInit {
  public appPages = [
    { title: 'Dashboard', url: '/admin-dashboard', icon: 'grid' },
    { title: 'Resident Management', url: '/admin-dashboard/residents', icon: 'people' },
    { title: 'User Management', url: '/admin-dashboard/users', icon: 'person-circle' },
    { title: 'Request Management', url: '/admin-dashboard/requests', icon: 'document-text' },
    { title: 'Department Info', url: '/admin-dashboard/departments', icon: 'business' },
    { title: 'Fee Calculator Settings', url: '/admin-dashboard/fee-settings', icon: 'calculator' },
    { title: 'Announcements', url: '/admin-dashboard/announcements', icon: 'megaphone' },
    { title: 'Transaction Logs', url: '/admin-dashboard/transactions', icon: 'receipt' },
    { title: 'Help', url: '/admin-dashboard/help', icon: 'help-circle' },
    { title: 'System Settings', url: '/admin-dashboard/settings', icon: 'settings' },
  ];

  constructor() { }

  ngOnInit() {}

  logout() {
    // Implement logout logic here
    console.log('Logout clicked');
  }
}
