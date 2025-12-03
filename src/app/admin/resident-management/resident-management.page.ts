import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

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

    purokOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Filter variables
    selectedBarangay: string = '';
    selectedVoterStatus: string = '';
    selectedLifeStatus: string = '';
    searchText: string = '';

    // Selection & Modal state
    selectedResident: Resident | null = null;
    isModalOpen: boolean = false;
    modalMode: 'view' | 'edit' | 'add' = 'view';

    isDeleteConfirmOpen: boolean = false;

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

    // File input for CSV import
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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

    // helper to flatten multi-array into an object
    private flattenResidentArray(multiArray: any[][]): any {
        const obj: any = {};
        for (const section of multiArray) {
            for (const [key, value] of section) {
                obj[key] = value;
            }
        }
        return obj;
    }

    openModal(mode: 'view' | 'edit') {
        if (!this.selectedResident) return;

        this.modalMode = mode;

        // find the detailed multiArray for this resident by id
        const detailed = this.savedResidentArrays.find(arr => {
            const registrationSection = arr[0];
            const idPair = registrationSection.find((p: any[]) => p[0] === 'residentId');
            return (idPair && idPair[1] === this.selectedResident!.id);
        });

        if (detailed) {
            this.residentForm = this.flattenResidentArray(detailed);
        } else {
            // Fallback: split full name into parts
            const nameParts = this.selectedResident.name.split(' ').filter(p => p.trim().length > 0);
            let givenName = '';
            let middleName = '';
            let lastName = '';
            let extension = '';

            if (nameParts.length === 1) {
                givenName = nameParts[0];
            } else if (nameParts.length === 2) {
                givenName = nameParts[0];
                lastName = nameParts[1];
            } else if (nameParts.length >= 3) {
                givenName = nameParts[0];
                extension = nameParts[nameParts.length - 1];
                lastName = nameParts[nameParts.length - 2];
                if (nameParts.length > 3) {
                    middleName = nameParts.slice(1, nameParts.length - 2).join(' ');
                }
            }

            this.residentForm = {
                residentId: this.selectedResident.id,
                dateRegistered: this.selectedResident.dateRegistered,
                givenName,
                middleName,
                lastName,
                extension,
                lifeStatus: this.selectedResident.lifeStatus,
                voter: this.selectedResident.voterStatus === 'Registered'
            };
        }


        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedResident = null;

        this.residentForm = {};
        this.modalAddStep = 1;
    }

    updateResident() {
        if (!this.selectedResident) return;

        // recompute basic table fields from residentForm
        const fullName = `${this.residentForm.givenName || ''} ${this.residentForm.middleName || ''} ${this.residentForm.lastName || ''} ${this.residentForm.extension || ''}`
            .replace(/\s+/g, ' ')
            .trim();

        const updated: Resident = {
            ...this.selectedResident,
            name: fullName,
            age: this.residentForm.birthday
                ? new Date().getFullYear() - new Date(this.residentForm.birthday).getFullYear()
                : this.selectedResident.age,
            address: [
                this.residentForm.houseNo,
                this.residentForm.street,
                this.residentForm.purok ? `Purok ${this.residentForm.purok}` : null,
                this.residentForm.barangay,
                this.residentForm.city,
                this.residentForm.province
            ]
                .filter(Boolean)
                .join(', '),
            voterStatus: this.residentForm.voter ? 'Registered' : 'Not Registered',
            lifeStatus: this.residentForm.lifeStatus || 'Alive',
            dateRegistered: this.residentForm.dateRegistered || this.selectedResident.dateRegistered
        };


        // update arrays and localStorage
        const idx = this.allResidents.findIndex(r => r.id === this.selectedResident!.id);
        if (idx !== -1) this.allResidents[idx] = updated;

        const listIdx = this.residents.findIndex(r => r.id === this.selectedResident!.id);
        if (listIdx !== -1) this.residents[listIdx] = updated;

        localStorage.setItem('resident_list', JSON.stringify(this.allResidents));

        // also update savedResidentArrays detailed entry
        const detailedIndex = this.savedResidentArrays.findIndex(arr => {
            const registrationSection = arr[0];
            const idPair = registrationSection.find((p: any[]) => p[0] === 'residentId');
            return (idPair && idPair[1] === this.selectedResident!.id);
        });
        if (detailedIndex !== -1) {
            const updatedMulti = [
                [
                    ['residentId', this.residentForm.residentId || updated.id],
                    ['dateRegistered', updated.dateRegistered]
                ],
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
                [
                    ['houseNo', this.residentForm.houseNo],
                    ['street', this.residentForm.street],
                    ['purok', this.residentForm.purok],
                    ['barangay', this.residentForm.barangay],
                    ['city', this.residentForm.city],
                    ['province', this.residentForm.province],
                    ['residencyYears', this.residentForm.residencyYears],
                    ['phone', this.residentForm.phone],
                    ['email', this.residentForm.email]
                ],
                [
                    ['idType', this.residentForm.idType],
                    ['idNumber', this.residentForm.idNumber],
                    ['idFileName', this.residentForm.idFile ? this.residentForm.idFile.name : null]
                ],
                [
                    ['householdHead', this.residentForm.householdHead],
                    ['householdHeadRel', this.residentForm.householdHeadRel],
                    ['houseOwnership', this.residentForm.houseOwnership]
                ],
                [
                    ['occupation', this.residentForm.occupation],
                    ['education', this.residentForm.education],
                    ['pwd', this.residentForm.pwd],
                    ['seniorCitizen', this.residentForm.seniorCitizen],
                    ['soloParent', this.residentForm.soloParent],
                    ['fourPs', this.residentForm.fourPs],
                    ['indigenousGroup', this.residentForm.indigenousGroup]
                ],
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
            this.savedResidentArrays[detailedIndex] = updatedMulti;
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.savedResidentArrays));
        }
        this.showToast('Resident updated successfully.', 'success');
        this.closeModal();
    }


    openDeleteConfirm() {
        if (!this.selectedResident) return;
        this.isDeleteConfirmOpen = true;
    }

    closeDeleteConfirm() {
        this.isDeleteConfirmOpen = false;
    }

    confirmDeleteResident() {
        if (!this.selectedResident) return;

        const id = this.selectedResident.id;

        // 1) Remove from in-memory arrays
        this.allResidents = this.allResidents.filter(r => r.id !== id);
        this.residents = this.residents.filter(r => r.id !== id);

        // 2) Persist updated list to localStorage
        localStorage.setItem('resident_list', JSON.stringify(this.allResidents));

        // 3) Also remove detailed multi-array entry (if it exists)
        const idx = this.savedResidentArrays.findIndex(arr => {
            const registrationSection = arr[0];
            const idPair = registrationSection.find((p: any[]) => p[0] === 'residentId');
            return idPair && idPair[1] === id;
        });
        if (idx !== -1) {
            this.savedResidentArrays.splice(idx, 1);
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.savedResidentArrays));
        }

        this.showToast('Resident deleted successfully.', 'success');
        // 4) Clear selection and close confirm modal
        this.selectedResident = null;
        this.isDeleteConfirmOpen = false;
    }


    importFile() {
        if (this.fileInput) {
            this.fileInput.nativeElement.value = ''; // reset so same file can be reselected
            this.fileInput.nativeElement.click();
        }
    }

    onImportFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) {
            return;
        }

        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result as string;
            this.processCsv(text);
        };

        reader.readAsText(file);
    }

    private processCsv(text: string) {
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) {
            this.showToast('CSV file has no data rows.', 'error');
            return;
        }

        // Header from your sample CSV
        const header = lines[0].split(',').map(h => h.trim().toLowerCase());

        const idxDateReg = header.indexOf('date registered'.toLowerCase());
        const idxGiven = header.indexOf('given name'.toLowerCase());
        const idxMiddle = header.indexOf('middle name'.toLowerCase());
        const idxLast = header.indexOf('last name'.toLowerCase());
        const idxExt = header.indexOf('extension'.toLowerCase());
        const idxBirthday = header.indexOf('birthday'.toLowerCase());
        const idxHouseNo = header.indexOf('house no'.toLowerCase());
        const idxStreet = header.indexOf('street'.toLowerCase());
        const idxPurok = header.indexOf('purok'.toLowerCase());
        const idxBarangay = header.indexOf('barangay'.toLowerCase());
        const idxCity = header.indexOf('city'.toLowerCase());
        const idxProvince = header.indexOf('province'.toLowerCase());
        const idxLife = header.indexOf('life status'.toLowerCase());
        const idxVoter = header.indexOf('voter'.toLowerCase());

        const newResidents: Resident[] = [];

        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(',');
            if (row.length === 0 || row.every(c => c.trim() === '')) {
                continue;
            }

            const given = idxGiven >= 0 ? row[idxGiven].trim() : '';
            const middle = idxMiddle >= 0 ? row[idxMiddle].trim() : '';
            const last = idxLast >= 0 ? row[idxLast].trim() : '';
            const ext = idxExt >= 0 ? row[idxExt].trim() : '';

            // Build full name
            const fullName = `${given} ${middle} ${last} ${ext}`
                .replace(/\s+/g, ' ')
                .trim();

            if (!fullName) {
                continue;
            }

            const dateRegistered = idxDateReg >= 0
                ? row[idxDateReg].trim()
                : new Date().toISOString().slice(0, 10);

            const birthdayStr = idxBirthday >= 0 ? row[idxBirthday].trim() : '';
            let age = 0;
            if (birthdayStr) {
                const birthYear = new Date(birthdayStr).getFullYear();
                if (!isNaN(birthYear)) {
                    age = new Date().getFullYear() - birthYear;
                }
            }

            const houseNo = idxHouseNo >= 0 ? row[idxHouseNo].trim() : '';
            const street = idxStreet >= 0 ? row[idxStreet].trim() : '';
            const purok = idxPurok >= 0 ? row[idxPurok].trim() : '';
            const barangay = idxBarangay >= 0 ? row[idxBarangay].trim() : '';
            const city = idxCity >= 0 ? row[idxCity].trim() : '';
            const province = idxProvince >= 0 ? row[idxProvince].trim() : '';

            const addressParts: string[] = [];
            if (houseNo) addressParts.push(houseNo);
            if (street) addressParts.push(street);
            if (purok) addressParts.push(`Purok ${purok}`);
            if (barangay) addressParts.push(barangay);
            if (city) addressParts.push(city);
            if (province) addressParts.push(province);

            const address = addressParts.join(', ');

            const lifeStatus = idxLife >= 0 ? (row[idxLife].trim() || 'Alive') : 'Alive';
            const voterRaw = idxVoter >= 0 ? row[idxVoter].trim().toLowerCase() : '';
            const voterStatus = voterRaw === 'true' || voterRaw === 'yes' ? 'Registered' : 'Not Registered';

            const newId =
                this.allResidents.length + newResidents.length > 0
                    ? Math.max(
                        0,
                        ...this.allResidents.map(r => r.id),
                        ...newResidents.map(r => r.id)
                    ) + 1
                    : 1;

            const resident: Resident = {
                id: newId,
                name: fullName,
                age,
                address,
                voterStatus,
                lifeStatus,
                dateRegistered
            };

            newResidents.push(resident);

            // Build a minimal detailed structure for this imported resident
            const importedForm: any = {
                residentId: newId,
                dateRegistered,
                givenName: given,
                middleName: middle,
                lastName: last,
                extension: ext,
                birthday: birthdayStr,
                houseNo,
                street,
                purok,
                barangay,
                city,
                province,
                lifeStatus,
                voter: voterStatus === 'Registered'
            };

            // Build multiArray like in addResident()
            const multiArray = [
                // Registration
                [
                    ['residentId', importedForm.residentId],
                    ['dateRegistered', importedForm.dateRegistered]
                ],
                // Basic info
                [
                    ['givenName', importedForm.givenName],
                    ['middleName', importedForm.middleName],
                    ['lastName', importedForm.lastName],
                    ['extension', importedForm.extension],
                    ['gender', null],
                    ['birthday', importedForm.birthday],
                    ['birthPlace', null],
                    ['civilStatus', null]
                ],
                // Address & contact
                [
                    ['houseNo', importedForm.houseNo],
                    ['street', importedForm.street],
                    ['purok', importedForm.purok],
                    ['barangay', importedForm.barangay],
                    ['city', importedForm.city],
                    ['province', importedForm.province],
                    ['residencyYears', null],
                    ['phone', null],
                    ['email', null]
                ],
                // Identification
                [
                    ['idType', null],
                    ['idNumber', null],
                    ['idFileName', null]
                ],
                // Household
                [
                    ['householdHead', null],
                    ['householdHeadRel', null],
                    ['houseOwnership', null]
                ],
                // Social & demographic
                [
                    ['occupation', null],
                    ['education', null],
                    ['pwd', false],
                    ['seniorCitizen', false],
                    ['soloParent', false],
                    ['fourPs', false],
                    ['indigenousGroup', null]
                ],
                // Emergency & record status
                [
                    ['emerContactName', null],
                    ['emerContactRel', null],
                    ['emerContactNumber', null],
                    ['lifeStatus', importedForm.lifeStatus],
                    ['remarks', null],
                    ['voter', importedForm.voter],
                    ['precinctNo', null]
                ]
            ];

            // Store alongside others
            this.savedResidentArrays.push(multiArray);
        }

        if (newResidents.length === 0) {
            alert('No valid residents found in CSV.');
            return;
        }

        this.allResidents = [...newResidents, ...this.allResidents];
        this.residents = [...this.allResidents];

        // Persist flat table list and detailed arrays
        localStorage.setItem('resident_list', JSON.stringify(this.allResidents));
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.savedResidentArrays));

        this.showToast(`Imported ${newResidents.length} residents from CSV.`, 'success');
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
            street: '',
            purok: '',
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

        const f = this.residentForm;

        const isValid =
            f.dateRegistered &&
            f.givenName &&
            f.lastName &&
            f.gender &&
            f.birthday &&
            f.birthPlace &&
            f.civilStatus &&
            f.street &&
            f.purok &&
            f.barangay &&
            f.lifeStatus &&
            (f.voter === true || f.voter === false);

        if (!isValid) {
            this.showToast('Please complete all required fields before saving.', 'error');
            return;
        }

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
                this.residentForm.street,
                this.residentForm.purok ? `Purok ${this.residentForm.purok}` : null,
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
                ['street', this.residentForm.street],
                ['purok', this.residentForm.purok],
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
        this.showToast('Resident added successfully.', 'success');
        this.closeModal();
    }


    toastMessage: string = '';
    toastType: 'success' | 'error' | 'info' = 'info';
    isToastVisible: boolean = false;

    showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
        this.toastMessage = message;
        this.toastType = type;
        this.isToastVisible = true;

        setTimeout(() => {
            this.isToastVisible = false;
        }, 3000);
    }


}
