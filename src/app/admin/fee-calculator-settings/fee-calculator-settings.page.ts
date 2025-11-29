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

    constructor(
        private alertCtrl: AlertController,
        private toastCtrl: ToastController
    ) { }

    ngOnInit() {
        // Initialize component
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

    async openAddFeeModal() {
        const alert = await this.alertCtrl.create({
            header: 'Add New Fee Structure',
            message: 'Enter the details for the new fee structure',
            inputs: [
                {
                    name: 'permitType',
                    type: 'text',
                    placeholder: 'Permit/Service Type'
                },
                {
                    name: 'category',
                    type: 'text',
                    placeholder: 'Category (Business, Construction, etc.)'
                },
                {
                    name: 'baseFee',
                    type: 'number',
                    placeholder: 'Base Fee (optional)'
                },
                {
                    name: 'percentageRate',
                    type: 'number',
                    placeholder: 'Percentage Rate (%)',
                    value: '0'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Add',
                    handler: (data) => {
                        if (!data.permitType || !data.category) {
                            this.showToast('Please fill in all required fields', 'warning');
                            return false;
                        }

                        const newFee: FeeStructure = {
                            id: Date.now().toString(),
                            permitType: data.permitType,
                            category: data.category,
                            baseFee: data.baseFee ? parseFloat(data.baseFee) : null,
                            percentageRate: parseFloat(data.percentageRate) || 0
                        };

                        this.feeStructures.push(newFee);
                        this.showToast('Fee structure added successfully', 'success');
                        return true;
                    }
                }
            ]
        });

        await alert.present();
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
