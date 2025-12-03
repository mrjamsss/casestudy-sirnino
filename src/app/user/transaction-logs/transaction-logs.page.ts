import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export interface DocumentRequest {
    id: number;
    userName: string;
    userEmail?: string;
    departmentName: string;
    serviceName: string;
    purpose: string;
    notes: string;
    status: string;
    dateRequested: string;
}

@Component({
    selector: 'app-transaction-logs',
    templateUrl: './transaction-logs.page.html',
    styleUrls: ['./transaction-logs.page.scss'],
    standalone: false
})
export class TransactionLogsPage implements OnInit {

    selectedSegment: string = 'requests';

    // Document Requests - ONLY Pending (still waiting)
    processingRequests: DocumentRequest[] = [];

    // All Transactions - Approved, Rejected, Ready for Pickup, Completed (processed)
    completedTransactions: DocumentRequest[] = [];

    currentUserEmail: string = '';
    currentUserName: string = '';

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.loadCurrentUser();
        this.loadUserRequests();
    }

    ionViewWillEnter() {
        this.loadCurrentUser();
        this.loadUserRequests();
    }

    loadCurrentUser() {
        const currentUser = this.authService.getCurrentUser();
        this.currentUserEmail = currentUser?.email || '';

        // Build full name to match against userName field
        if (currentUser) {
            this.currentUserName = `${currentUser.name.givenName} ${currentUser.name.middleInitial ? currentUser.name.middleInitial + '. ' : ''}${currentUser.name.lastName}${currentUser.name.extension ? ' ' + currentUser.name.extension : ''}`.trim();
        }

        console.log('Current user email:', this.currentUserEmail);
        console.log('Current user name:', this.currentUserName);
    }

    loadUserRequests() {
        const storedRequests = localStorage.getItem('document_requests');
        console.log('Raw localStorage data:', storedRequests);

        if (storedRequests) {
            try {
                const allRequests: DocumentRequest[] = JSON.parse(storedRequests);
                console.log('All requests:', allRequests);

                // Filter requests for current user by email OR name
                const userRequests = allRequests.filter(req => {
                    const emailMatch = req.userEmail && req.userEmail.toLowerCase() === this.currentUserEmail.toLowerCase();
                    const nameMatch = req.userName && req.userName.toLowerCase().includes(this.currentUserName.toLowerCase());

                    console.log(`Request ${req.id}:`, {
                        userName: req.userName,
                        userEmail: req.userEmail,
                        emailMatch,
                        nameMatch,
                        status: req.status
                    });

                    return emailMatch || nameMatch;
                });

                console.log('User requests (filtered):', userRequests);

                // Document Requests - ONLY Pending
                this.processingRequests = userRequests.filter(req => {
                    const status = (req.status || '').toLowerCase().trim();
                    const isPending = status === 'pending';

                    console.log(`Request ${req.id} - Status: "${req.status}" -> Is Pending: ${isPending}`);
                    return isPending;
                });

                // All Transactions - Everything else (Approved, Rejected, Ready, Completed)
                this.completedTransactions = userRequests.filter(req => {
                    const status = (req.status || '').toLowerCase().trim();
                    const isProcessed = status === 'processing' ||
                        status === 'approved' ||
                        status === 'ready' ||
                        status === 'rejected' ||
                        status === 'completed';

                    console.log(`Request ${req.id} - Status: "${req.status}" -> Is Processed: ${isProcessed}`);
                    return isProcessed;
                });

                console.log('Document Requests (Pending only):', this.processingRequests);
                console.log('All Transactions (Processed):', this.completedTransactions);

            } catch (e) {
                console.error('Error loading requests:', e);
            }
        } else {
            console.log('No requests found in localStorage');
        }
    }

    getStatusClass(status: string): string {
        const statusLower = (status || '').toLowerCase().trim();
        switch (statusLower) {
            case 'pending':
                return 'pending';
            case 'processing':
            case 'approved':
                return 'processing';
            case 'ready':
                return 'ready';
            case 'rejected':
                return 'rejected';
            case 'completed':
                return 'completed';
            default:
                return 'pending';
        }
    }

    getStatusDisplayText(status: string): string {
        const statusLower = (status || '').toLowerCase().trim();
        switch (statusLower) {
            case 'processing':
            case 'approved':
                return 'Approved';
            case 'ready':
                return 'Ready for Pickup';
            case 'pending':
                return 'Pending';
            case 'rejected':
                return 'Rejected';
            case 'completed':
                return 'Completed';
            default:
                return status;
        }
    }

    formatDate(dateString: string): string {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    }

    getRequestId(id: number): string {
        return 'REQ' + id.toString().padStart(6, '0');
    }
}
