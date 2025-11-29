import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from '../../shared/services/announcement.service';
import { Announcement, AnnouncementType } from '../../shared/models/announcement.model';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { AnnouncementModalComponent } from '../../shared/components/announcement-modal/announcement-modal.component';

@Component({
    selector: 'app-announcements',
    templateUrl: './announcements.page.html',
    styleUrls: ['./announcements.page.scss'],
    standalone: false
})
export class AnnouncementsPage implements OnInit {
    announcements: Announcement[] = [];

    constructor(
        private announcementService: AnnouncementService,
        private alertController: AlertController,
        private toastController: ToastController,
        private modalController: ModalController
    ) { }

    ngOnInit() {
        this.loadAnnouncements();
    }

    loadAnnouncements() {
        this.announcementService.getAnnouncements().subscribe(
            announcements => {
                this.announcements = announcements;
            }
        );
    }

    async openCreateModal() {
        const modal = await this.modalController.create({
            component: AnnouncementModalComponent,
            cssClass: 'announcement-modal',
            backdropDismiss: false
        });

        modal.onDidDismiss().then((result) => {
            if (result.data && result.data.announcement) {
                this.createAnnouncement(result.data.announcement);
            }
        });

        return await modal.present();
    }

    async openEditModal(announcement: Announcement) {
        const modal = await this.modalController.create({
            component: AnnouncementModalComponent,
            cssClass: 'announcement-modal',
            componentProps: {
                announcement: announcement,
                isEdit: true
            },
            backdropDismiss: false
        });

        modal.onDidDismiss().then((result) => {
            if (result.data && result.data.announcement) {
                this.updateAnnouncement(announcement.id, result.data.announcement);
            }
        });

        return await modal.present();
    }

    createAnnouncement(announcementData: any) {
        this.announcementService.createAnnouncement({
            title: announcementData.title,
            type: announcementData.type,
            description: announcementData.description,
            createdBy: 'Admin', // You can replace this with actual admin name
            isActive: true,
            audience: announcementData.audience
        });

        this.showToast('Announcement created successfully!', 'success');
    }

    updateAnnouncement(id: string, announcementData: any) {
        this.announcementService.updateAnnouncement(id, {
            title: announcementData.title,
            type: announcementData.type,
            description: announcementData.description,
            audience: announcementData.audience
        });

        this.showToast('Announcement updated successfully!', 'success');
    }

    async toggleStatus(announcement: Announcement) {
        this.announcementService.toggleAnnouncementStatus(announcement.id);
        const status = !announcement.isActive ? 'activated' : 'deactivated';
        await this.showToast(`Announcement ${status}`, 'success');
    }

    async confirmDelete(announcement: Announcement) {
        const alert = await this.alertController.create({
            header: 'Delete Announcement',
            message: `Are you sure you want to delete "${announcement.title}"?`,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        this.deleteAnnouncement(announcement.id);
                    }
                }
            ]
        });

        await alert.present();
    }

    async deleteAnnouncement(id: string) {
        this.announcementService.deleteAnnouncement(id);
        await this.showToast('Announcement deleted', 'success');
    }

    getTypeColor(type: AnnouncementType): string {
        const colors: Record<AnnouncementType, string> = {
            info: 'primary',
            warning: 'warning',
            urgent: 'danger',
            maintenance: 'secondary',
            event: 'tertiary'
        };
        return colors[type];
    }

    getTypeIcon(type: AnnouncementType): string {
        const icons: Record<AnnouncementType, string> = {
            info: 'information-circle',
            warning: 'warning',
            urgent: 'alert-circle',
            maintenance: 'construct',
            event: 'calendar'
        };
        return icons[type];
    }

    getActiveCount(): number {
        return this.announcements.filter(a => a.isActive).length;
    }

    getInactiveCount(): number {
        return this.announcements.filter(a => !a.isActive).length;
    }

    getAudienceIcon(audience: string): string {
        const icons: Record<string, string> = {
            citizens: 'people',
            admins: 'shield-checkmark',
            both: 'globe'
        };
        return icons[audience] || 'globe';
    }

    getAudienceLabel(audience: string): string {
        const labels: Record<string, string> = {
            citizens: 'Citizens',
            admins: 'Admins',
            both: 'Everyone'
        };
        return labels[audience] || 'Everyone';
    }

    async showToast(message: string, color: string) {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
            color,
            position: 'top'
        });
        await toast.present();
    }
}
