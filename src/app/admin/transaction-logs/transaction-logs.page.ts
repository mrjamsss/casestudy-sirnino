import { Component, OnInit } from '@angular/core';

export interface DocumentRequest {
    id: string;
    type: string;
    department: string;
    date: string;
    status: 'processing' | 'completed';
    notes: string;
}

@Component({
    selector: 'app-transaction-logs',
    templateUrl: './transaction-logs.page.html',
    styleUrls: ['./transaction-logs.page.scss'],
    standalone: false
})
export class TransactionLogsPage implements OnInit {

    selectedSegment: string = 'requests';

    requests: DocumentRequest[] = [
        {
            id: 'REQ001',
            type: 'Birth Certificate',
            department: 'Civil Registry',
            date: '2024-11-01',
            status: 'processing',
            notes: 'Authenticated copy needed'
        },
        {
            id: 'REQ002',
            type: 'Business Permit',
            department: 'Business Permits Office',
            date: '2024-10-15',
            status: 'completed',
            notes: '-'
        }
    ];

    constructor() { }

    ngOnInit() {
    }

}
