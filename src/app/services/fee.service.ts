import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FeeStructure {
    id: string;
    permitType: string;
    category: string;
    baseFee: number | null;
    percentageRate: number;
}

export interface FeeCalculation {
    selectedFee: FeeStructure;
    capital: number;
    baseFeeAmount: number;
    percentageAmount: number;
    totalFee: number;
}

@Injectable({
    providedIn: 'root'
})
export class FeeService {
    private readonly STORAGE_KEY = 'feeStructures';
    private defaultFeeStructures: FeeStructure[] = [
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

    private feeStructuresSubject = new BehaviorSubject<FeeStructure[]>([]);

    public feeStructures$: Observable<FeeStructure[]> = this.feeStructuresSubject.asObservable();

    constructor() {
        this.loadFromLocalStorage();
    }

    /**
     * Load fee structures from localStorage
     */
    private loadFromLocalStorage(): void {
        const storedFees = localStorage.getItem(this.STORAGE_KEY);
        if (storedFees) {
            try {
                const fees = JSON.parse(storedFees);
                this.feeStructuresSubject.next(fees);
            } catch (error) {
                console.error('Error parsing fee structures from localStorage:', error);
                this.initializeDefaults();
            }
        } else {
            this.initializeDefaults();
        }
    }

    /**
     * Initialize with default fee structures and save to localStorage
     */
    private initializeDefaults(): void {
        this.feeStructuresSubject.next(this.defaultFeeStructures);
        this.saveToLocalStorage();
    }

    /**
     * Save current fee structures to localStorage
     */
    private saveToLocalStorage(): void {
        const currentFees = this.feeStructuresSubject.value;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentFees));
    }

    /**
     * Get all fee structures
     */
    getFeeStructures(): FeeStructure[] {
        return this.feeStructuresSubject.value;
    }

    /**
     * Get a specific fee structure by ID
     */
    getFeeStructureById(id: string): FeeStructure | undefined {
        return this.feeStructuresSubject.value.find(fee => fee.id === id);
    }

    /**
     * Get fee structures by category
     */
    getFeeStructuresByCategory(category: string): FeeStructure[] {
        return this.feeStructuresSubject.value.filter(fee => fee.category === category);
    }

    /**
     * Calculate fee based on fee structure and capital/project cost
     */
    calculateFee(feeStructure: FeeStructure, capital: number): FeeCalculation {
        const baseFeeAmount = feeStructure.baseFee || 0;
        const percentageAmount = (capital * feeStructure.percentageRate) / 100;
        const totalFee = baseFeeAmount + percentageAmount;

        return {
            selectedFee: feeStructure,
            capital,
            baseFeeAmount,
            percentageAmount,
            totalFee
        };
    }

    /**
     * Add a new fee structure
     */
    addFeeStructure(fee: FeeStructure): void {
        const currentFees = this.feeStructuresSubject.value;
        this.feeStructuresSubject.next([...currentFees, fee]);
        this.saveToLocalStorage();
    }

    /**
     * Update an existing fee structure
     */
    updateFeeStructure(updatedFee: FeeStructure): void {
        const currentFees = this.feeStructuresSubject.value;
        const index = currentFees.findIndex(f => f.id === updatedFee.id);
        if (index !== -1) {
            currentFees[index] = updatedFee;
            this.feeStructuresSubject.next([...currentFees]);
            this.saveToLocalStorage();
        }
    }

    /**
     * Delete a fee structure
     */
    deleteFeeStructure(id: string): void {
        const currentFees = this.feeStructuresSubject.value;
        this.feeStructuresSubject.next(currentFees.filter(f => f.id !== id));
        this.saveToLocalStorage();
    }
}
