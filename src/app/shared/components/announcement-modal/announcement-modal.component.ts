import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Announcement, AnnouncementType, AnnouncementAudience } from '../../models/announcement.model';

@Component({
    selector: 'app-announcement-modal',
    templateUrl: './announcement-modal.component.html',
    styleUrls: ['./announcement-modal.component.scss'],
    standalone: false
})
export class AnnouncementModalComponent implements OnInit {
    @Input() announcement?: Announcement;
    @Input() isEdit: boolean = false;

    title: string = '';
    type: AnnouncementType = 'info';
    description: string = '';
    audience: AnnouncementAudience = 'both';

    announcementTypes: { value: AnnouncementType; label: string; icon: string }[] = [
        { value: 'info', label: 'Information', icon: 'information-circle' },
        { value: 'warning', label: 'Warning', icon: 'warning' },
        { value: 'urgent', label: 'Urgent', icon: 'alert-circle' },
        { value: 'maintenance', label: 'Maintenance', icon: 'construct' },
        { value: 'event', label: 'Event', icon: 'calendar' }
    ];

    audienceOptions: { value: AnnouncementAudience; label: string; icon: string; description: string }[] = [
        {
            value: 'citizens',
            label: 'Citizens Only',
            icon: 'people',
            description: 'Visible to citizens/users only'
        },
        {
            value: 'admins',
            label: 'Admins Only',
            icon: 'shield-checkmark',
            description: 'Visible to administrators only'
        },
        {
            value: 'both',
            label: 'Everyone',
            icon: 'globe',
            description: 'Visible to both citizens and admins'
        }
    ];

    customPopoverOptions: any = {
        cssClass: 'announcement-popover',
        side: 'bottom',
        alignment: 'start'
    };

    constructor(private modalController: ModalController) { }

    ngOnInit() {
        if (this.isEdit && this.announcement) {
            this.title = this.announcement.title;
            this.type = this.announcement.type;
            this.description = this.announcement.description;
            this.audience = this.announcement.audience;
        }
    }

    dismiss() {
        this.modalController.dismiss();
    }

    save() {
        if (!this.title.trim() || !this.description.trim()) {
            return;
        }

        this.modalController.dismiss({
            announcement: {
                title: this.title,
                type: this.type,
                description: this.description,
                audience: this.audience
            }
        });
    }

    isFormValid(): boolean {
        return this.title.trim().length > 0 && this.description.trim().length > 0;
    }
}
