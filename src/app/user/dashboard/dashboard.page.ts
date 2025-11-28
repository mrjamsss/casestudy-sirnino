import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface StatCard {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  color: string;
}

interface RecentRequest {
  title: string;
  department: string;
  status: 'processing' | 'completed';
}

interface QuickAction {
  title: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {

  statCards: StatCard[] = [
    {
      title: 'Total Requests',
      value: 2,
      subtitle: 'All time submissions',
      icon: 'document-text-outline',
      color: 'primary'
    },
    {
      title: 'Pending',
      value: 1,
      subtitle: 'Awaiting processing',
      icon: 'time-outline',
      color: 'warning'
    },
    {
      title: 'Completed',
      value: 1,
      subtitle: 'Ready for pickup',
      icon: 'checkmark-circle-outline',
      color: 'success'
    },
    {
      title: 'Notifications',
      value: 1,
      subtitle: 'Unread messages',
      icon: 'notifications-outline',
      color: 'info'
    }
  ];

  recentRequests: RecentRequest[] = [
    {
      title: 'Birth Certificate',
      department: 'Civil Registry',
      status: 'processing'
    },
    {
      title: 'Business Permit',
      department: 'Business Permits Office',
      status: 'completed'
    }
  ];

  quickActions: QuickAction[] = [
    {
      title: 'Request New Document',
      icon: 'document-text-outline',
      route: '/citizen-portal/requests'
    },
    {
      title: 'Calculate Permit Fees',
      icon: 'calculator-outline',
      route: '/citizen-portal/fee-calculator'
    },
    {
      title: 'View Requirements',
      icon: 'checkmark-done-outline',
      route: '/citizen-portal/requirements'
    },
    {
      title: 'Community Programs',
      icon: 'people-outline',
      route: '/citizen-portal/programs'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    // Fetch user data from services
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  viewAllRequests() {
    this.router.navigate(['/citizen-portal/requests']);
  }

  getStatusClass(status: string): string {
    return status === 'processing' ? 'status-processing' : 'status-completed';
  }

  getStatusLabel(status: string): string {
    return status;
  }

}
