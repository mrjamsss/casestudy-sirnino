import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-fee-structure-modal',
    templateUrl: './fee-structure-modal.component.html',
    styleUrls: ['./fee-structure-modal.component.scss'],
    standalone: false
})
export class FeeStructureModalComponent implements OnInit {
    permitType: string = '';
    category: string = '';
    baseFee: number | null = null;
    percentageRate: number = 0;

    permitTypes: string[] = [
        'Birth Certificate',
        'Marriage Certificate',
        'Death Certificate',
        'Business Permit',
        'Barangay Clearance',
        'Residency Certificate',
        'Health Certificate'
    ];

    constructor(private modalCtrl: ModalController) { }

    ngOnInit() { }

    dismiss() {
        this.modalCtrl.dismiss();
    }

    save() {
        this.modalCtrl.dismiss({
            permitType: this.permitType,
            category: this.category,
            baseFee: this.baseFee,
            percentageRate: this.percentageRate
        });
    }

    isFormValid(): boolean {
        const isBaseFeeValid = this.baseFee === null || this.baseFee >= 0;
        const isPercentageValid = this.percentageRate >= 0;
        return !!this.permitType && !!this.category && isBaseFeeValid && isPercentageValid;
    }
}
