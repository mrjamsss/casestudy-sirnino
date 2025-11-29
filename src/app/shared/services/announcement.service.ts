import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Announcement } from '../models/announcement.model';

@Injectable({
    providedIn: 'root'
})
export class AnnouncementService {
    private readonly STORAGE_KEY = 'announcements';
    private announcementsSubject = new BehaviorSubject<Announcement[]>([]);
    public announcements$: Observable<Announcement[]> = this.announcementsSubject.asObservable();

    constructor() {
        this.loadAnnouncements();
    }

    private loadAnnouncements(): void {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                const announcements = JSON.parse(stored);
                // Convert date strings back to Date objects
                announcements.forEach((a: any) => {
                    a.createdAt = new Date(a.createdAt);
                });
                this.announcementsSubject.next(announcements);
            } catch (error) {
                console.error('Error loading announcements:', error);
                this.announcementsSubject.next([]);
            }
        }
    }

    private saveAnnouncements(announcements: Announcement[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(announcements));
        this.announcementsSubject.next(announcements);
    }

    getAnnouncements(): Observable<Announcement[]> {
        return this.announcements$;
    }

    getActiveAnnouncements(): Observable<Announcement[]> {
        return new Observable(observer => {
            this.announcements$.subscribe(announcements => {
                const active = announcements.filter(a => a.isActive);
                observer.next(active);
            });
        });
    }

    getAnnouncementById(id: string): Announcement | undefined {
        return this.announcementsSubject.value.find(a => a.id === id);
    }

    createAnnouncement(announcement: Omit<Announcement, 'id' | 'createdAt'>): void {
        const announcements = this.announcementsSubject.value;
        const newAnnouncement: Announcement = {
            ...announcement,
            id: this.generateId(),
            createdAt: new Date()
        };
        announcements.unshift(newAnnouncement); // Add to beginning
        this.saveAnnouncements(announcements);
    }

    updateAnnouncement(id: string, updates: Partial<Announcement>): void {
        const announcements = this.announcementsSubject.value;
        const index = announcements.findIndex(a => a.id === id);
        if (index !== -1) {
            announcements[index] = { ...announcements[index], ...updates };
            this.saveAnnouncements(announcements);
        }
    }

    deleteAnnouncement(id: string): void {
        const announcements = this.announcementsSubject.value.filter(a => a.id !== id);
        this.saveAnnouncements(announcements);
    }

    toggleAnnouncementStatus(id: string): void {
        const announcements = this.announcementsSubject.value;
        const index = announcements.findIndex(a => a.id === id);
        if (index !== -1) {
            announcements[index].isActive = !announcements[index].isActive;
            this.saveAnnouncements(announcements);
        }
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
