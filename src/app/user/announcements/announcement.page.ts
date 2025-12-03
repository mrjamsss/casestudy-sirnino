import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from '../../shared/services/announcement.service';
import { Announcement, AnnouncementType } from '../../shared/models/announcement.model';

@Component({
    selector: 'app-announcements',
    templateUrl: './announcement.page.html',
    styleUrls: ['./announcement.page.scss'],
    standalone: false
})
export class AnnouncementsPage implements OnInit {
    announcements: Announcement[] = [];
    filteredAnnouncements: Announcement[] = [];
    selectedFilter: 'all' | AnnouncementType = 'all';
    searchQuery: string = '';

    announcementTypes: { value: AnnouncementType; label: string; icon: string }[] = [
        { value: 'info', label: 'Information', icon: 'information-circle' },
        { value: 'warning', label: 'Warning', icon: 'warning' },
        { value: 'urgent', label: 'Urgent', icon: 'alert-circle' },
        { value: 'maintenance', label: 'Maintenance', icon: 'construct' },
        { value: 'event', label: 'Event', icon: 'calendar' }
    ];

    constructor(private announcementService: AnnouncementService) { }

    ngOnInit() {
        this.loadAnnouncements();
    }

    loadAnnouncements() {
        // Only show active announcements to users that are for citizens or everyone
        this.announcementService.getActiveAnnouncements().subscribe(
            announcements => {
                // Filter to show only announcements for citizens or both
                this.announcements = announcements.filter(
                    a => a.audience === 'citizens' || a.audience === 'both'
                );
                this.applyFilter();
            }
        );
    }

    filterByType(type: 'all' | AnnouncementType) {
        this.selectedFilter = type;
        this.applyFilter();
    }

    applyFilter() {
        let filtered = this.announcements;

        // Filter by Type
        if (this.selectedFilter !== 'all') {
            filtered = filtered.filter(a => a.type === this.selectedFilter);
        }

        // Filter by Search Query
        if (this.searchQuery && this.searchQuery.trim() !== '') {
            const query = this.searchQuery.toLowerCase().trim();
            filtered = filtered.filter(a =>
                a.title.toLowerCase().includes(query) ||
                a.description.toLowerCase().includes(query)
            );
        }

        this.filteredAnnouncements = filtered;
    }

    clearFilters() {
        this.selectedFilter = 'all';
        this.searchQuery = '';
        this.applyFilter();
    }

    getTypeColor(type: AnnouncementType): string {
        const colors: Record<AnnouncementType, string> = {
            info: 'primary',
            warning: 'warning',
            urgent: 'danger',
            maintenance: 'secondary',
            event: 'primary'
        };
        return colors[type];
    }

    getTypeIcon(type: AnnouncementType): string {
        const typeObj = this.announcementTypes.find(t => t.value === type);
        return typeObj?.icon || 'information-circle';
    }

    getTypeLabel(type: AnnouncementType): string {
        const typeObj = this.announcementTypes.find(t => t.value === type);
        return typeObj?.label || type;
    }
}
