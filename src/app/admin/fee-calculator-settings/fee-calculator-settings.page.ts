import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

interface FeeStructure {
    id: string;
    permitType: string;
    category: string;
    baseFee: number | null;
    percentageRate: number;
}

@Component({
    selector: 'app-fee-calculator-settings',
    templateUrl: './fee-calculator-settings.page.html',
    styleUrls: ['./fee-calculator-settings.page.scss'],
    standalone: false,
})
export class FeeCalculatorSettingsPage implements OnInit {
    feeStructures: FeeStructure[] = [
        {
            id: '1',
            permitType: 'New Business Permit',
            category: 'Business',
            baseFee: 5000,
            percentageRate: 1
        },
        {
            id: '2',
            permitType: 'Business Permit Renewal',
            category: 'Business',
            baseFee: 2500,
            percentageRate: 0.5
        },
        {
            id: '3',
            permitType: 'Building Permit',
            category: 'Construction',
            baseFee: null,
            percentageRate: 2
        },
        {
            id: '4',
            permitType: 'Sanitary Permit',
            category: 'Health',
            baseFee: 500,
            percentageRate: 0
        }
    ];

    isEditing = false;
    editingFee: FeeStructure = this.getEmptyFee();
    showAddFeeModal = false;
    newFee: FeeStructure = this.getEmptyFee();

    constructor(
        private alertCtrl: AlertController,
        private toastCtrl: ToastController
    ) { }

    ngOnInit() {
        this.loadFeeStructures();
    }

    loadFeeStructures() {
        const storedFees = localStorage.getItem('feeStructures');
        if (storedFees) {
            this.feeStructures = JSON.parse(storedFees);
        } else {
            this.saveToLocalStorage();
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('feeStructures', JSON.stringify(this.feeStructures));
    }

    getEmptyFee(): FeeStructure {
        return {
            id: '',
            permitType: '',
            category: '',
            baseFee: null,
            percentageRate: 0
        };
    }

    openAddFeeModal() {
        this.newFee = this.getEmptyFee();
        this.showAddFeeModal = true;
    }

    closeAddFeeModal() {
        this.showAddFeeModal = false;
    }

    saveNewFee() {
        if (!this.newFee.permitType || !this.newFee.category) {
            this.showToast('Please fill in all required fields', 'warning');
            return;
        }

        const newFeeEntry: FeeStructure = {
            ...this.newFee,
            id: Date.now().toString(),
            baseFee: this.newFee.baseFee ? Number(this.newFee.baseFee) : null,
            percentageRate: Number(this.newFee.percentageRate) || 0
        };

        this.feeStructures.push(newFeeEntry);
        this.saveToLocalStorage();
        this.showToast('Fee structure added successfully', 'success');
        this.closeAddFeeModal();
    }

    editFee(fee: FeeStructure) {
        this.isEditing = true;
        this.editingFee = { ...fee };

        // Scroll to edit form
        setTimeout(() => {
            const editCard = document.querySelector('.edit-card');
            if (editCard) {
                editCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }

    async saveFee() {
        if (!this.editingFee.permitType || !this.editingFee.category) {
            this.showToast('Please fill in all required fields', 'warning');
            return;
        }

        const index = this.feeStructures.findIndex(f => f.id === this.editingFee.id);
        if (index !== -1) {
            this.feeStructures[index] = { ...this.editingFee };
            this.saveToLocalStorage();
            this.showToast('Fee structure updated successfully', 'success');
            this.cancelEdit();
        }
    }

    cancelEdit() {
        this.isEditing = false;
        this.editingFee = this.getEmptyFee();
    }

    async deleteFee(fee: FeeStructure) {
        const alert = await this.alertCtrl.create({
            header: 'Delete Fee Structure',
            message: `Are you sure you want to delete "${fee.permitType}"?`,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        this.feeStructures = this.feeStructures.filter(f => f.id !== fee.id);
                        this.saveToLocalStorage();
                        this.showToast('Fee structure deleted', 'success');
                    }
                }
            ]
        });

        await alert.present();
    }

    async showToast(message: string, color: string) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 2000,
            position: 'bottom',
            color
        });
        await toast.present();
    }
}
