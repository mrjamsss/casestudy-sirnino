import { Component, OnInit } from '@angular/core';
import { FeeService, FeeStructure, FeeCalculation } from '../../services/fee.service';

@Component({
    selector: 'app-fee-calculator',
    templateUrl: './fee-calculator.page.html',
    styleUrls: ['./fee-calculator.page.scss'],
    standalone: false
})
export class FeeCalculatorPage implements OnInit {
    feeStructures: FeeStructure[] = [];
    selectedFeeId: string = '';
    capital: number = 0;
    calculation: FeeCalculation | null = null;
    showResults: boolean = false;

    constructor(private feeService: FeeService) { }

    ngOnInit() {
        // Load fee structures from the service
        this.feeStructures = this.feeService.getFeeStructures();

        // Subscribe to changes in fee structures
        this.feeService.feeStructures$.subscribe(fees => {
            this.feeStructures = fees;
        });
    }

    /**
     * Handle permit type selection
     */
    onPermitTypeChange() {
        // Reset results when permit type changes
        this.showResults = false;
        this.calculation = null;
    }

    /**
     * Handle capital input change
     */
    onCapitalChange() {
        // Reset results when capital changes
        this.showResults = false;
        this.calculation = null;
    }

    /**
     * Calculate the fee based on selected permit and capital
     */
    calculateFee() {
        if (!this.selectedFeeId || !this.capital || this.capital <= 0) {
            this.showResults = false;
            this.calculation = null;
            return;
        }

        const selectedFee = this.feeService.getFeeStructureById(this.selectedFeeId);
        if (selectedFee) {
            this.calculation = this.feeService.calculateFee(selectedFee, this.capital);
            this.showResults = true;
        }
    }

    /**
     * Reset the calculator
     */
    resetCalculator() {
        this.selectedFeeId = '';
        this.capital = 0;
        this.calculation = null;
        this.showResults = false;
    }

    /**
     * Get category badge color
     */
    getCategoryColor(category: string): string {
        const colors: { [key: string]: string } = {
            'Business': 'primary',
            'Construction': 'warning',
            'Health': 'success',
            'Civil': 'tertiary',
            'Other': 'medium'
        };
        return colors[category] || 'medium';
    }
}
