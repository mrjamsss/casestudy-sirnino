import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../../shared/services/sidebar.service';

interface StatCard {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  color: string;
}

interface Request {
  id: string;
  user: string;
  documentType: string;
  department: string;
  date: string;
  status: 'processing' | 'completed' | 'pending';
}

interface Notification {
  title: string;
  message: string;
  type: 'warning' | 'info';
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
  stats: StatCard[] = [
    {
      title: 'Total Users',
      value: 2,
      subtitle: 'Registered citizens',
      icon: 'people-outline',
      color: '#6c757d'
    },
    {
      title: 'All Requests',
      value: 3,
      subtitle: 'Total submissions',
      icon: 'document-text-outline',
      color: '#6c757d'
    },
    {
      title: 'Pending',
      value: 1,
      subtitle: 'Awaiting action',
      icon: 'time-outline',
      color: '#f5a623'
    },
    {
      title: 'Completed',
      value: 1,
      subtitle: 'This month',
      icon: 'checkmark-circle-outline',
      color: '#28a745'
    }
  ];

  recentRequests: Request[] = [
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

  notifications: Notification[] = [
    {
      title: 'Pending Approvals',
      message: '1 requests need review',
      type: 'warning',
      icon: 'alert-circle-outline'
    },
    {
      title: 'System Update',
      message: 'All systems operational',
      type: 'info',
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

  constructor(
    private sidebarService: SidebarService,
    private router: Router
  ) { }

  ngOnInit() { }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
