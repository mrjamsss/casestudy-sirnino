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

    allResidents: Resident[] = []

    residents: Resident[] = [];

    // Filter variables
    selectedBarangay: string = '';
    selectedVoterStatus: string = '';
    selectedLifeStatus: string = '';
    searchText: string = '';

    // Selection & Modal state
    selectedResident: Resident | null = null;
    isModalOpen: boolean = false;
    modalMode: 'view' | 'edit' | 'add' = 'view';

    // Modal Form models (view/edit)
    modalName: string = '';
    modalAge: number = 0;
    modalAddress: string = '';
    modalVoterStatus: string = '';
    modalLifeStatus: string = '';

    // Add Resident (multi-step)
    residentForm: any = {};
    modalAddStep: number = 1;
    maxAddStep: number = 7;

    // Local storage
    localStorageKey = 'barangay_residents';
    savedResidentArrays: any[] = [];

    constructor() { }

    ngOnInit() {
        // Load saved detailed arrays
        const saved = localStorage.getItem(this.localStorageKey);
        this.savedResidentArrays = saved ? JSON.parse(saved) : [];

        // Load table residents (or empty array if none)
        const residentList = localStorage.getItem('resident_list');
        this.allResidents = residentList ? JSON.parse(residentList) : [];

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

        // Optional: reset add form when closing
        this.residentForm = {};
        this.modalAddStep = 1;
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
        if (!this.searchText || this.searchText.trim() === '') {
            this.filterResidents();
        }
    }

    filterResidents() {
        this.residents = this.allResidents.filter(resident => {
            const matchesBarangay = !this.selectedBarangay || this.selectedBarangay === 'all' ||
                resident.address.toLowerCase().includes(this.selectedBarangay.toLowerCase());

            const matchesVoterStatus = !this.selectedVoterStatus || this.selectedVoterStatus === 'all' ||
                resident.voterStatus.toLowerCase() === this.selectedVoterStatus.toLowerCase();

            const matchesLifeStatus = !this.selectedLifeStatus || this.selectedLifeStatus === 'all' ||
                resident.lifeStatus.toLowerCase() === this.selectedLifeStatus.toLowerCase();

            const matchesSearch = !this.searchText ||
                resident.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
                resident.address.toLowerCase().includes(this.searchText.toLowerCase());

            return matchesBarangay && matchesVoterStatus && matchesLifeStatus && matchesSearch;
        });

        if (this.selectedResident && !this.residents.find(r => r.id === this.selectedResident!.id)) {
            this.selectedResident = null;
        }
    }

    // --- Add Resident (multi-step) ---

    onIdFileChange(event: any) {
        const input = event.target as HTMLInputElement | null;
        if (input && input.files && input.files.length > 0) {
            this.residentForm.idFile = input.files[0];
        } else {
            this.residentForm.idFile = null;
        }
    }

    openAddModal() {
        this.modalMode = 'add';
        this.selectedResident = null;
        this.isModalOpen = true;
        this.modalAddStep = 1;
        this.residentForm = {
            gender: '',
            civilStatus: '',
            barangay: '',
            residencyYears: '',
            pwd: false,
            seniorCitizen: false,
            soloParent: false,
            fourPs: false,
            voter: false
        };
    }

    nextAddStep() {
        if (this.modalAddStep < this.maxAddStep) this.modalAddStep++;
    }

    prevAddStep() {
        if (this.modalAddStep > 1) this.modalAddStep--;
    }
    addResident() {
        if (this.modalAddStep !== 7) {
            // Optional: prevent saving if not on last step
            // return;
        }

        if (this.residentForm.givenName && this.residentForm.lastName) {
            const maxId =
                this.allResidents.length > 0
                    ? Math.max(...this.allResidents.map(r => r.id))
                    : 0;

            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const dateRegistered =
                this.residentForm.dateRegistered || `${year}-${month}-${day}`;

            // 1) Normal Resident object (for table)
            const fullName = `${this.residentForm.givenName || ''} ${this.residentForm.middleName || ''} ${this.residentForm.lastName || ''} ${this.residentForm.extension || ''}`
                .replace(/\s+/g, ' ')
                .trim();

            const newResident: Resident = {
                id: maxId + 1,
                name: fullName,
                age: this.residentForm.birthday
                    ? new Date().getFullYear() - new Date(this.residentForm.birthday).getFullYear()
                    : 0,
                address: [
                    this.residentForm.houseNo,
                    this.residentForm.barangay,
                    this.residentForm.city,
                    this.residentForm.province
                ]
                    .filter(Boolean)
                    .join(', '),
                voterStatus: this.residentForm.voter ? 'Registered' : 'Not Registered',
                lifeStatus: this.residentForm.lifeStatus || 'Alive',
                dateRegistered
            };

            this.allResidents = [newResident, ...this.allResidents];
            this.filterResidents();

            const storedResidents = localStorage.getItem('resident_list');
            const parsed: Resident[] = storedResidents ? JSON.parse(storedResidents) : [];
            parsed.unshift(newResident);
            localStorage.setItem('resident_list', JSON.stringify(parsed));

            // 2) Multi-dimensional array representation (grouped by sections)
            const multiArray = [
                // Registration
                [
                    ['residentId', this.residentForm.residentId || newResident.id],
                    ['dateRegistered', dateRegistered]
                ],
                // Basic info
                [
                    ['givenName', this.residentForm.givenName],
                    ['middleName', this.residentForm.middleName],
                    ['lastName', this.residentForm.lastName],
                    ['extension', this.residentForm.extension],
                    ['gender', this.residentForm.gender],
                    ['birthday', this.residentForm.birthday],
                    ['birthPlace', this.residentForm.birthPlace],
                    ['civilStatus', this.residentForm.civilStatus]
                ],
                // Address & contact
                [
                    ['houseNo', this.residentForm.houseNo],
                    ['barangay', this.residentForm.barangay],
                    ['city', this.residentForm.city],
                    ['province', this.residentForm.province],
                    ['residencyYears', this.residentForm.residencyYears],
                    ['phone', this.residentForm.phone],
                    ['email', this.residentForm.email]
                ],
                // Identification
                [
                    ['idType', this.residentForm.idType],
                    ['idNumber', this.residentForm.idNumber],
                    // file references cannot be stored directly, so save name only
                    ['idFileName', this.residentForm.idFile ? this.residentForm.idFile.name : null]
                ],
                // Household
                [
                    ['householdHead', this.residentForm.householdHead],
                    ['householdHeadRel', this.residentForm.householdHeadRel],
                    ['houseOwnership', this.residentForm.houseOwnership]
                ],
                // Social & demographic
                [
                    ['occupation', this.residentForm.occupation],
                    ['education', this.residentForm.education],
                    ['pwd', this.residentForm.pwd],
                    ['seniorCitizen', this.residentForm.seniorCitizen],
                    ['soloParent', this.residentForm.soloParent],
                    ['fourPs', this.residentForm.fourPs],
                    ['indigenousGroup', this.residentForm.indigenousGroup]
                ],
                // Emergency & record status
                [
                    ['emerContactName', this.residentForm.emerContactName],
                    ['emerContactRel', this.residentForm.emerContactRel],
                    ['emerContactNumber', this.residentForm.emerContactNumber],
                    ['lifeStatus', this.residentForm.lifeStatus],
                    ['remarks', this.residentForm.remarks],
                    ['voter', this.residentForm.voter],
                    ['precinctNo', this.residentForm.precinctNo]
                ]
            ];

            // Push into in-memory array and persist to localStorage
            this.savedResidentArrays.push(multiArray);
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.savedResidentArrays));

            this.closeModal();
        } else {
            alert('Please fill in at least Given Name and Last Name before saving.');
        }
    }



}
