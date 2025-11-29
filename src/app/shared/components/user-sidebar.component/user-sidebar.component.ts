import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss'],
  standalone: false
})
export class UserSidebarComponent implements OnInit {
  public appPages = [
    { title: 'Dashboard', url: '/citizen-portal/dashboard', icon: 'grid' },
    { title: 'Request Document', url: '/citizen-portal/request-document', icon: 'document-text' },
    { title: 'Service Requirements', url: '/citizen-portal/service-requirements', icon: 'list' },
    { title: 'Fee Calculator', url: '/citizen-portal/fee-calculator', icon: 'calculator' },
    { title: 'Announcements', url: '/citizen-portal/announcements', icon: 'megaphone' },
    { title: 'Transaction Logs', url: '/citizen-portal/transaction-logs', icon: 'receipt' },
    { title: 'Help', url: '/citizen-portal/help', icon: 'help-circle' },
    { title: 'Account Settings', url: '/citizen-portal/account-settings', icon: 'person-circle' },
  ];

  constructor() { }

  ngOnInit() {}

  logout() {
    // Implement logout logic here
    console.log('Logout clicked');
  }
}
