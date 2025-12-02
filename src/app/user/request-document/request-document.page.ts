import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

interface Department {
  id: string;
  name: string;
  documents: DocumentType[];
}

interface DocumentType {
  id: string;
  name: string;
  purposes: string[];
}

@Component({
    selector: 'app-request-document',
    templateUrl: './request-document.page.html',
    styleUrls: ['./request-document.page.scss'],
    standalone: false
})
export class RequestDocumentPage implements OnInit {
    departments: Department[] = [
        {
            id: 'civil-registry',
            name: 'Civil Registry',
            documents: [
                {
                    id: 'birth-certificate',
                    name: 'Birth Certificate',
                    purposes: ['Employment', 'School Enrollment', 'Passport Application', 'Travel', 'Legal Matters', 'Other']
                },
                {
                    id: 'marriage-certificate',
                    name: 'Marriage Certificate',
                    purposes: ['Employment', 'Visa Application', 'Legal Matters', 'Bank Requirements', 'Other']
                },
                {
                    id: 'death-certificate',
                    name: 'Death Certificate',
                    purposes: ['Legal Matters', 'Insurance Claims', 'Estate Settlement', 'Other']
                }
            ]
        },
        {
            id: 'business-permits',
            name: 'Business Permits and Licensing Office',
            documents: [
                {
                    id: 'business-permit',
                    name: 'Business Permit',
                    purposes: ['New Business', 'Business Renewal', 'Business Expansion', 'Other']
                }
            ]
        },
        {
            id: 'treasury',
            name: 'Treasury Office',
            documents: [
                {
                    id: 'tax-clearance',
                    name: 'Tax Clearance Certificate',
                    purposes: ['Employment', 'Business Requirements', 'Loan Application', 'Legal Matters', 'Other']
                }
            ]
        },
        {
            id: 'health',
            name: 'Health Office',
            documents: [
                {
                    id: 'health-certificate',
                    name: 'Health Certificate',
                    purposes: ['Employment', 'School Requirements', 'Travel', 'Business Requirements', 'Other']
                }
            ]
        }
    ];

    availableDocuments: DocumentType[] = [];
    availablePurposes: string[] = [];
    
    selectedDepartment: string = '';
    selectedDocumentType: string = '';
    selectedPurpose: string = '';
    additionalNotes: string = '';

    constructor(
        private toastController: ToastController,
        private authService: AuthService
    ) { }

    ngOnInit() {
        // Component initialization
    }

    onDepartmentChange() {
        // Reset dependent fields
        this.selectedDocumentType = '';
        this.selectedPurpose = '';
        this.availableDocuments = [];
        this.availablePurposes = [];

        if (this.selectedDepartment) {
            const department = this.departments.find(d => d.id === this.selectedDepartment);
            if (department) {
                this.availableDocuments = department.documents;
            }
        }
    }

    onDocumentTypeChange() {
        // Reset purpose when document type changes
        this.selectedPurpose = '';
        this.availablePurposes = [];

        if (this.selectedDocumentType) {
            const document = this.availableDocuments.find(d => d.id === this.selectedDocumentType);
            if (document) {
                this.availablePurposes = document.purposes;
            }
        }
    }

    async submitRequest() {
        // Validate form
        if (!this.selectedDepartment || !this.selectedDocumentType || !this.selectedPurpose) {
            await this.showToast('Please fill in all required fields', 'warning');
            return;
        }

        // Get selected details
        const department = this.departments.find(d => d.id === this.selectedDepartment);
        const document = this.availableDocuments.find(d => d.id === this.selectedDocumentType);

        if (!department || !document) {
            await this.showToast('Invalid selection. Please try again.', 'danger');
            return;
        }

        // Get current user information
        const currentUser = this.authService.getCurrentUser();
        const userName = currentUser 
            ? `${currentUser.name.givenName} ${currentUser.name.middleInitial ? currentUser.name.middleInitial + '. ' : ''}${currentUser.name.lastName}${currentUser.name.extension ? ' ' + currentUser.name.extension : ''}`
            : 'Unknown User';

        // Create request object matching admin's expected format
        const request = {
            id: Date.now(),
            userName: userName,
            userEmail: currentUser?.email || '',
            departmentName: department.name,
            serviceName: document.name,
            purpose: this.selectedPurpose,
            notes: this.additionalNotes || 'No additional notes',
            status: 'Pending',
            dateRequested: new Date().toISOString()
        };

        // Save to localStorage
        const existingRequests = JSON.parse(localStorage.getItem('document_requests') || '[]');
        existingRequests.push(request);
        localStorage.setItem('document_requests', JSON.stringify(existingRequests));

        // Show success message
        await this.showToast(
            `Request submitted successfully! Your ${document.name} request for ${this.selectedPurpose} is now being processed.`, 
            'success'
        );

        // Reset form
        this.resetForm();
    }

    resetForm() {
        this.selectedDepartment = '';
        this.selectedDocumentType = '';
        this.selectedPurpose = '';
        this.additionalNotes = '';
        this.availableDocuments = [];
        this.availablePurposes = [];
    }

    async showToast(message: string, color: 'success' | 'warning' | 'danger') {
        const toast = await this.toastController.create({
            message: message,
            duration: 3000,
            position: 'top',
            color: color,
            buttons: [
                {
                    text: 'Dismiss',
                    role: 'cancel'
                }
            ]
        });
        await toast.present();
    }
}