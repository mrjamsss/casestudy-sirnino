import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private users = new BehaviorSubject<User[]>([]);
    private readonly STORAGE_KEY = 'cbn_registered_users';

    constructor() {
        this.loadFromStorage();
    }

    getUsers(): Observable<User[]> {
        return this.users.asObservable();
    }

    refresh(): void {
        this.loadFromStorage();
    }

    private loadFromStorage() {
        const storedUsers = localStorage.getItem(this.STORAGE_KEY);
        if (storedUsers) {
            try {
                const parsedUsers = JSON.parse(storedUsers);
                const mappedUsers: User[] = parsedUsers.map((u: any) => ({
                    id: u.email, // Use email as ID since it's unique
                    firstName: u.name?.givenName || '',
                    lastName: u.name?.lastName || '',
                    email: u.email,
                    role: u.role === 'admin' ? 'admin' : 'resident',
                    status: u.status.toLowerCase(), // Map 'Active' -> 'active', 'Pending' -> 'pending'
                    createdAt: u.dateRegistered ? new Date(u.dateRegistered) : new Date()
                }));
                this.users.next(mappedUsers);
            } catch (e) {
                console.error('Error loading users from storage:', e);
                this.users.next([]);
            }
        } else {
            this.users.next([]);
        }
    }

    addUser(user: User): void {
        // This might not be used if we rely on AuthService for registration, 
        // but keeping it for compatibility or future use.
        // Note: This won't update the actual cbn_registered_users format correctly 
        // without a full mapping back, so it's better to treat this service as read-only 
        // for now regarding the shared storage, or implement full mapping.
        // For the dashboard purpose (read-only), this is fine.
        const currentUsers = this.users.value;
        this.users.next([...currentUsers, user]);
    }
}
