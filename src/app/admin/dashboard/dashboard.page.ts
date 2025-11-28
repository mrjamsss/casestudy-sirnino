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
  id: string;
  user: string;
  documentType: string;
  department: string;
  date: string;
  status: 'processing' | 'completed' | 'pending';
}

interface SystemNotification {
  id: number;
  type: 'warning' | 'info';
  title: string;
  message: string;
  icon: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {

  statCards: StatCard[] = [
    {
      title: 'Total Users',
      value: 2,
      subtitle: 'Registered citizens',
      icon: 'people-outline',
      color: 'primary'
    },
    {
      title: 'All Requests',
      value: 3,
      subtitle: 'Total submissions',
      icon: 'document-text-outline',
      color: 'secondary'
    },
    {
      title: 'Pending',
      value: 1,
      subtitle: 'Awaiting action',
      icon: 'time-outline',
      color: 'warning'
    },
    {
      title: 'Completed',
      value: 1,
      subtitle: 'This month',
      icon: 'checkmark-circle-outline',
      color: 'success'
    }
  ];

  recentRequests: RecentRequest[] = [
    {
      id: 'REQ001',
      user: 'Juan dela Cruz',
      documentType: 'Birth Certificate',
      department: 'Civil Registry',
      date: '2024-11-01',
      status: 'processing'
    },
    {
      id: 'REQ002',
      user: 'Juan dela Cruz',
      documentType: 'Business Permit',
      department: 'Business Permits Office',
      date: '2024-10-15',
      status: 'completed'
    },
    {
      id: 'REQ003',
      user: 'Maria Santos',
      documentType: 'Barangay Clearance',
      department: 'Barangay Affairs',
      date: '2024-11-10',
      status: 'pending'
    }
  ];

  systemNotifications: SystemNotification[] = [
    {
      id: 1,
      type: 'warning',
      title: 'Pending Approvals',
      message: '1 requests need review',
      icon: 'alert-circle-outline'
    },
    {
      id: 2,
      type: 'info',
      title: 'System Update',
      message: 'All systems operational',
      icon: 'information-circle-outline'
    }
  ];

  quickActions: QuickAction[] = [
    {
      title: 'Review Requests',
      description: 'Process pending submissions',
      icon: 'document-text-outline',
      route: '/admin/request-management'
    },
    {
      title: 'Manage Users',
      description: 'View and update user accounts',
      icon: 'people-outline',
      route: '/admin/user-management'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    // In a real application, fetch data from services
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'processing': 'status-processing',
      'completed': 'status-completed',
      'pending': 'status-pending'
    };
    return statusMap[status] || '';
  }

  getStatusLabel(status: string): string {
    const labelMap: { [key: string]: string } = {
      'processing': 'processing',
      'completed': 'completed',
      'pending': 'pending'
    };
    return labelMap[status] || status;
  }

}
