import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../../shared/services/sidebar.service';
import { UserService } from '../../shared/services/user.service';
import { RequestService } from '../../shared/services/request.service';
import { Request } from '../../shared/models/request.model';
import { Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

interface StatCard {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  color: string;
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
export class DashboardPage implements OnInit, OnDestroy {
  stats: StatCard[] = [];
  recentRequests: Request[] = [];
  private subscriptions: Subscription = new Subscription();

  notifications: Notification[] = [
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
    private router: Router,
    private userService: UserService,
    private requestService: RequestService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      combineLatest([
        this.userService.getUsers(),
        this.requestService.getRequests()
      ]).subscribe(([users, requests]) => {
        // Filter out pending users to match User Management logic
        const activeUsersCount = users.filter(u => u.status !== 'pending').length;
        this.updateStats(activeUsersCount, requests);
        this.recentRequests = requests.slice(0, 5); // Show top 5 recent requests
      })
    );
  }

  ionViewWillEnter() {
    this.userService.refresh();
    this.requestService.refresh();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private updateStats(totalUsers: number, requests: Request[]) {
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const completedRequests = requests.filter(r => r.status === 'completed' || r.status === 'ready').length;

    this.stats = [
      {
        title: 'Total Users',
        value: totalUsers,
        subtitle: 'Registered citizens',
        icon: 'people-outline',
        color: '#6c757d'
      },
      {
        title: 'All Requests',
        value: totalRequests,
        subtitle: 'Total submissions',
        icon: 'document-text-outline',
        color: '#6c757d'
      },
      {
        title: 'Pending',
        value: pendingRequests,
        subtitle: 'Awaiting action',
        icon: 'time-outline',
        color: '#f5a623'
      },
      {
        title: 'Completed',
        value: completedRequests,
        subtitle: 'This month',
        icon: 'checkmark-circle-outline',
        color: '#28a745'
      }
    ];

    // Update notifications based on pending requests
    this.notifications = [
      {
        title: 'System Update',
        message: 'All systems operational',
        type: 'info',
        icon: 'information-circle-outline'
      }
    ];

    if (pendingRequests > 0) {
      this.notifications.unshift({
        title: 'Pending Approvals',
        message: `${pendingRequests} requests need review`,
        type: 'warning',
        icon: 'alert-circle-outline'
      });
    }
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
