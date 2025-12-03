import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Request } from '../models/request.model';

@Injectable({
    providedIn: 'root'
})
export class RequestService {
    private requests = new BehaviorSubject<Request[]>([]);
    private readonly STORAGE_KEY = 'document_requests';

    constructor() {
        this.loadFromStorage();
    }

    getRequests(): Observable<Request[]> {
        return this.requests.asObservable();
    }

    refresh(): void {
        this.loadFromStorage();
    }

    private loadFromStorage() {
        const storedRequests = localStorage.getItem(this.STORAGE_KEY);
        if (storedRequests) {
            try {
                const parsedRequests = JSON.parse(storedRequests);
                const mappedRequests: Request[] = parsedRequests.map((req: any) => {
                    const reqId = req.id.toString();
                    return {
                        id: req.id.toString().startsWith('REQ') ? req.id : 'REQ' + reqId.padStart(3, '0'),
                        userId: req.userId,
                        userFullName: req.userName || req.user || 'Unknown User',
                        documentType: req.serviceName || req.documentType,
                        department: req.departmentName || req.department,
                        date: req.dateRequested ? new Date(req.dateRequested).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
                        status: (req.status || 'pending').toLowerCase(),
                        purpose: req.purpose || 'Not specified',
                        details: req.notes || req.details || 'No additional details provided',
                        dateRequested: req.dateRequested
                    };
                });
                this.requests.next(mappedRequests);
            } catch (e) {
                console.error('Error loading requests from storage:', e);
                this.requests.next([]);
            }
        } else {
            this.requests.next([]);
        }
    }

    addRequest(request: Request): void {
        const currentRequests = this.requests.value;
        const updatedRequests = [request, ...currentRequests];
        this.requests.next(updatedRequests);
        this.saveToStorage(updatedRequests);
    }

    updateStatus(id: string, status: 'pending' | 'processing' | 'completed' | 'rejected' | 'ready'): void {
        const currentRequests = this.requests.value;
        const index = currentRequests.findIndex(r => r.id === id);
        if (index !== -1) {
            const updatedRequests = [...currentRequests];
            updatedRequests[index] = { ...updatedRequests[index], status };
            this.requests.next(updatedRequests);
            this.saveToStorage(updatedRequests);
        }
    }

    deleteRequest(id: string): void {
        const currentRequests = this.requests.value;
        const updatedRequests = currentRequests.filter(r => r.id !== id);
        this.requests.next(updatedRequests);
        this.saveToStorage(updatedRequests);
    }

    private saveToStorage(requests: Request[]) {
        // Map back to the format expected by the existing localStorage structure if needed, 
        // or just save as is if we are migrating fully. 
        // For now, let's try to maintain compatibility with the existing format seen in RequestManagementPage
        const requestsToSave = requests.map(req => ({
            id: req.id.replace(/\D/g, ''), // Extract numeric ID if possible, or keep as is
            userName: req.userFullName,
            departmentName: req.department,
            serviceName: req.documentType,
            purpose: req.purpose,
            notes: req.details,
            status: req.status.charAt(0).toUpperCase() + req.status.slice(1), // Capitalize for storage
            dateRequested: req.dateRequested
        }));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(requestsToSave));
    }
}
