import { Component, OnInit } from '@angular/core';

export interface DocumentRequest {
    id: string;
    type: string;
    department: string;
    date: string;
    status: 'processing' | 'completed';
    notes: string;
}

export interface TransactionLog {
    id: string;
    requestId: string;
    user: string;
    documentType: string;
    action: 'Approved' | 'Rejected' | 'Ready for Pickup';
    timestamp: string;
    details: string;
}

@Component({
    selector: 'app-transaction-logs',
    templateUrl: './transaction-logs.page.html',
    styleUrls: ['./transaction-logs.page.scss'],
    standalone: false
})
export class TransactionLogsPage implements OnInit {

    selectedSegment: string = 'requests';
    transactionLogs: TransactionLog[] = [];
    requests: DocumentRequest[] = [];

    constructor() { }

    ngOnInit() {
        this.loadRequests();
        this.loadTransactionLogs();
    }

    ionViewWillEnter() {
        this.loadRequests();
        this.loadTransactionLogs();
    }

    loadRequests() {
        const storedRequests = localStorage.getItem('document_requests');
        if (storedRequests) {
            try {
                const parsedRequests = JSON.parse(storedRequests);
                // Map the stored requests to the DocumentRequest interface used in this page
                // Note: request-management uses different property names (userName vs user, serviceName vs type/documentType)
                // We need to map them correctly.
                // Based on request-management.page.ts saveRequests:
                // id: number, userName: string, departmentName: string, serviceName: string, notes: string, status: string, dateRequested: string

                this.requests = parsedRequests.map((req: any) => ({
                    id: 'REQ' + req.id.toString().padStart(3, '0'),
                    type: req.serviceName,
                    department: req.departmentName,
                    date: new Date(req.dateRequested).toLocaleDateString('en-GB'), // or keep original format if preferred
                    status: (req.status || 'pending').toLowerCase(),
                    notes: req.notes || '-'
                }));
            } catch (e) {
                console.error('Error loading requests:', e);
            }
        }
    }

    loadTransactionLogs() {
        const storedLogs = localStorage.getItem('transaction_logs');
        if (storedLogs) {
            try {
                this.transactionLogs = JSON.parse(storedLogs);
            } catch (e) {
                console.error('Error loading transaction logs:', e);
            }
        }
    }

    getActionColor(action: string): string {
        switch (action) {
            case 'Approved': return 'success';
            case 'Rejected': return 'danger';
            case 'Ready for Pickup': return 'primary';
            default: return 'medium';
        }
    }
}
