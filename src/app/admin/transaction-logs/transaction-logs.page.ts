import { Component, OnInit } from '@angular/core';

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

    transactionLogs: TransactionLog[] = [];

    constructor() { }

    ngOnInit() {
        this.loadTransactionLogs();
    }

    ionViewWillEnter() {
        this.loadTransactionLogs();
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
