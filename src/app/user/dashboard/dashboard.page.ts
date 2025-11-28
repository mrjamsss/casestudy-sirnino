import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {
  stats = [
    { title: 'Total Requests', value: '2', subtitle: 'All time submissions', icon: 'document-text-outline', color: '#3498db' },
    { title: 'Pending', value: '1', subtitle: 'Awaiting processing', icon: 'time-outline', color: '#f1c40f' },
    { title: 'Completed', value: '1', subtitle: 'Ready for pickup', icon: 'checkmark-circle-outline', color: '#2ecc71' },
    { title: 'Notifications', value: '1', subtitle: 'Unread messages', icon: 'information-circle-outline', color: '#3498db' }
  ];

  recentRequests = [
    { title: 'Birth Certificate', department: 'Civil Registry', status: 'processing', statusClass: 'processing' },
    { title: 'Business Permit', department: 'Business Permits Office', status: 'completed', statusClass: 'completed' }
  ];

  quickActions = [
    { title: 'Request New Document', icon: 'document-text-outline' },
    { title: 'Calculate Permit Fees', icon: 'time-outline' },
    { title: 'View Requirements', icon: 'checkmark-circle-outline' },
    { title: 'Community Programs', icon: 'information-circle-outline' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
