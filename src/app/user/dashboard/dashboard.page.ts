import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../../shared/services/request.service';
import { AuthService } from '../../services/auth.service';
import { AnnouncementService } from '../../shared/services/announcement.service';
import { Request } from '../../shared/models/request.model';
import { Subscription } from 'rxjs';

interface StatCard {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  color: string;
}

interface QuickAction {
  title: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit, OnDestroy {
  stats: StatCard[] = [];
  recentRequests: Request[] = [];
  quickActions: QuickAction[] = [
    { title: 'Request New Document', icon: 'document-text-outline', route: '/user/request-document' },
    { title: 'Calculate Permit Fees', icon: 'calculator-outline', route: '/user/fee-calculator' },
    { title: 'View Requirements', icon: 'checkmark-circle-outline', route: '/user/service-requirements' },
    { title: 'Community Programs', icon: 'information-circle-outline', route: '/user/announcements' }
  ];

  private subscription: Subscription = new Subscription();
  private currentUserEmail: string = '';

  constructor(
    private requestService: RequestService,
    private authService: AuthService,
    private announcementService: AnnouncementService,
    private router: Router
  ) { }

  ngOnInit() {
    // Get current user
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUserEmail = currentUser.email;
    }

    // Subscribe to requests and announcements
    this.subscription.add(
      this.requestService.getRequests().subscribe(allRequests => {
        // Filter requests for current user
        const userRequests = allRequests.filter(req =>
          req.userId === this.currentUserEmail ||
          req.userFullName.toLowerCase().includes(currentUser?.name.givenName.toLowerCase() || '')
        );

        this.recentRequests = userRequests.slice(0, 5); // Show top 5 recent requests

        // Get announcements and update stats
        this.announcementService.getActiveAnnouncements().subscribe(activeAnnouncements => {
          this.updateStats(userRequests, activeAnnouncements.length);
        });
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private updateStats(requests: Request[], activeAnnouncementsCount: number) {
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'processing').length;
    const completedRequests = requests.filter(r => r.status === 'completed' || r.status === 'ready').length;

    this.stats = [
      {
        title: 'Total Requests',
        value: totalRequests,
        subtitle: 'All time submissions',
        icon: 'document-text-outline',
        color: '#3498db'
      },
      {
        title: 'Pending',
        value: pendingRequests,
        subtitle: 'Awaiting processing',
        icon: 'time-outline',
        color: '#f1c40f'
      },
      {
        title: 'Completed',
        value: completedRequests,
        subtitle: 'Ready for pickup',
        icon: 'checkmark-circle-outline',
        color: '#2ecc71'
      },
      {
        title: 'Announcements',
        value: activeAnnouncementsCount,
        subtitle: 'Active announcements',
        icon: 'megaphone-outline',
        color: '#3498db'
      }
    ];
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }





  onStatCardClick(stat: StatCard): void {
    if (stat.title === 'Announcements') {
      this.router.navigate(['/user/announcements']);
    }
  }
}
