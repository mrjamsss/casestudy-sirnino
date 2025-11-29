export interface Announcement {
    id: string;
    title: string;
    type: 'info' | 'warning' | 'urgent' | 'maintenance' | 'event';
    description: string;
    createdAt: Date;
    createdBy: string;
    isActive: boolean;
    audience: 'citizens' | 'admins' | 'both';
}

export type AnnouncementType = 'info' | 'warning' | 'urgent' | 'maintenance' | 'event';
export type AnnouncementAudience = 'citizens' | 'admins' | 'both';
