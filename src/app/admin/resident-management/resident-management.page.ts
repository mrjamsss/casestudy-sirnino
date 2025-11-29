import { Component, OnInit } from '@angular/core';

export interface Resident {
    id: number;
    name: string;
    age: number;
    address: string;
    voterStatus: string;
    lifeStatus: string;
    dateRegistered: string;
}

@Component({
    selector: 'app-resident-management',
    templateUrl: './resident-management.page.html',
    styleUrls: ['./resident-management.page.scss'],
    standalone: false
})
export class ResidentManagementPage implements OnInit {

    allResidents: Resident[] = [
        {
            id: 187,
            name: 'Grace Amor Cortez',
            age: 33,
            address: 'Aduas Centro, Cabanatuan City',
            voterStatus: 'Not Registered',
            lifeStatus: 'Alive',
            dateRegistered: '2025-01-10'
        },
        {
            id: 186,
            name: 'Jose Medina',
            age: 37,
            address: 'Bagong Buhay, Cabanatuan City',
            voterStatus: 'Registered',
            lifeStatus: 'Alive',
            dateRegistered: '2025-01-09'
        },
        {
            id: 185,
            name: 'Elena R. Fajardo',
            age: 22,
            address: 'Balite, Cabanatuan City',
            voterStatus: 'Not Registered',
            lifeStatus: 'Alive',
            dateRegistered: '2025-01-08'
        },
        {
            id: 184,
            name: 'Maria Santos',
            age: 45,
            address: 'Sangitan, Cabanatuan City',
            voterStatus: 'Registered',
            lifeStatus: 'Alive',
            dateRegistered: '2025-01-07'
        },
        {
            id: 183,
            name: 'Juan Dela Cruz',
            age: 28,
            address: 'Sumacab Norte, Cabanatuan City',
            voterStatus: 'Registered',
            lifeStatus: 'Alive',
            dateRegistered: '2025-01-06'
        }
    ];

    residents: Resident[] = [];

    // Filter variables
    selectedBarangay: string = '';
    selectedVoterStatus: string = '';
    selectedLifeStatus: string = '';
    searchText: string = '';

    // Selection & Modal state
    selectedResident: Resident | null = null;
    isModalOpen: boolean = false;
    modalMode: 'view' | 'edit' = 'view';

    // Modal Form models
    modalName: string = '';
    modalAge: number = 0;
    modalAddress: string = '';
    modalVoterStatus: string = '';
    modalLifeStatus: string = '';

    constructor() { }

    ngOnInit() {
        this.residents = [...this.allResidents];
    }

    // --- Table Actions & Selection ---

    selectResident(resident: Resident) {
        this.selectedResident = this.selectedResident === resident ? null : resident;
    }

    openModal(mode: 'view' | 'edit') {
        if (!this.selectedResident) return;

        this.modalMode = mode;
        this.modalName = this.selectedResident.name;
        this.modalAge = this.selectedResident.age;
        this.modalAddress = this.selectedResident.address;
        this.modalVoterStatus = this.selectedResident.voterStatus;
        this.modalLifeStatus = this.selectedResident.lifeStatus;
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.modalName = '';
        this.modalAge = 0;
        this.modalAddress = '';
        this.modalVoterStatus = '';
        this.modalLifeStatus = '';
    }

    updateResident() {
        if (this.selectedResident && this.modalName && this.modalAge && this.modalAddress) {
            const index = this.residents.findIndex(r => r.id === this.selectedResident!.id);
            if (index !== -1) {
                this.residents[index] = {
                    ...this.selectedResident,
                    name: this.modalName,
                    age: this.modalAge,
                    address: this.modalAddress,
                    voterStatus: this.modalVoterStatus,
                    lifeStatus: this.modalLifeStatus
                };
                this.selectedResident = this.residents[index];
            }
            this.closeModal();
        }
    }

    deleteSelectedResident() {
        if (this.selectedResident) {
            if (confirm(`Are you sure you want to delete ${this.selectedResident.name}?`)) {
                this.residents = this.residents.filter(r => r.id !== this.selectedResident!.id);
                this.selectedResident = null;
            }
        }
    }

    importFile() {
        // Placeholder for import functionality
        alert('Import file functionality will be implemented here');
    }

    // --- Filtering ---

    onSearchInput() {
        // Only filter automatically when search text is empty (user deleted all text)
        if (!this.searchText || this.searchText.trim() === '') {
            this.filterResidents();
        }
    }

    filterResidents() {
        this.residents = this.allResidents.filter(resident => {
            // Filter by barangay
            const matchesBarangay = !this.selectedBarangay || this.selectedBarangay === 'all' ||
                resident.address.toLowerCase().includes(this.selectedBarangay.toLowerCase());

            // Filter by voter status
            const matchesVoterStatus = !this.selectedVoterStatus || this.selectedVoterStatus === 'all' ||
                resident.voterStatus.toLowerCase() === this.selectedVoterStatus.toLowerCase();

            // Filter by life status
            const matchesLifeStatus = !this.selectedLifeStatus || this.selectedLifeStatus === 'all' ||
                resident.lifeStatus.toLowerCase() === this.selectedLifeStatus.toLowerCase();

            // Filter by search text (name or address)
            const matchesSearch = !this.searchText ||
                resident.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
                resident.address.toLowerCase().includes(this.searchText.toLowerCase());

            return matchesBarangay && matchesVoterStatus && matchesLifeStatus && matchesSearch;
        });

        // Clear selection if the selected resident is no longer in the filtered list
        if (this.selectedResident && !this.residents.find(r => r.id === this.selectedResident!.id)) {
            this.selectedResident = null;
        }
    }

}
