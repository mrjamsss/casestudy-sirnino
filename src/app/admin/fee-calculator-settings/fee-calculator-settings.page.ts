import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { FeeService, FeeStructure } from '../../services/fee.service';



@Component({
    selector: 'app-fee-calculator-settings',
    templateUrl: './fee-calculator-settings.page.html',
    styleUrls: ['./fee-calculator-settings.page.scss'],
    standalone: false,
})
export class FeeCalculatorSettingsPage implements OnInit {
    feeStructures: FeeStructure[] = [];

    isEditing = false;
    editingFee: FeeStructure = this.getEmptyFee();
    showAddFeeModal = false;
    newFee: FeeStructure = this.getEmptyFee();

    constructor(
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private feeService: FeeService
    ) { }

    ngOnInit() {
        this.loadFeeStructures();
    }

    loadFeeStructures() {
        // Load fee structures from the service
        this.feeStructures = this.feeService.getFeeStructures();

        // Subscribe to changes in fee structures
        this.feeService.feeStructures$.subscribe(fees => {
            this.feeStructures = fees;
        });
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

        this.feeService.addFeeStructure(newFeeEntry);
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

        this.feeService.updateFeeStructure({ ...this.editingFee });
        this.showToast('Fee structure updated successfully', 'success');
        this.cancelEdit();
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
                        this.feeService.deleteFeeStructure(fee.id);
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
