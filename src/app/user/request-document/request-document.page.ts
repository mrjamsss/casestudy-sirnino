import { Component, OnInit } from '@angular/core';
import { DepartmentsService } from '../../services/departments.service';
import { Department, Service } from '../../shared/models/department.interface';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-request-document',
    templateUrl: './request-document.page.html',
    styleUrls: ['./request-document.page.scss'],
    standalone: false
})
export class RequestDocumentPage implements OnInit {
    departments: Department[] = [];
    availableServices: Service[] = [];
    
    selectedDepartment: number | null = null;
    selectedDocumentType: number | null = null;
    additionalNotes: string = '';

    constructor(
        private departmentsService: DepartmentsService,
        private toastController: ToastController,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.loadDepartments();
    }

    loadDepartments() {
        this.departmentsService.getDepartments().subscribe(data => {
            this.departments = data;
        });
    }

    onDepartmentChange() {
        // Reset document type when department changes
        this.selectedDocumentType = null;
        this.availableServices = [];

        if (this.selectedDepartment) {
            const department = this.departments.find(d => d.id === this.selectedDepartment);
            if (department) {
                this.availableServices = department.services;
            }
        }
    }

    async submitRequest() {
        // Validate form
        if (!this.selectedDepartment || !this.selectedDocumentType) {
            await this.showToast('Please select both department and document type', 'warning');
            return;
        }

        // Get selected department and service details
        const department = this.departments.find(d => d.id === this.selectedDepartment);
        const service = this.availableServices.find(s => s.id === this.selectedDocumentType);

        if (!department || !service) {
            await this.showToast('Invalid selection. Please try again.', 'danger');
            return;
        }

        // Get current user information
        const currentUser = this.authService.getCurrentUser();
        const userName = currentUser 
            ? `${currentUser.name.givenName} ${currentUser.name.middleInitial ? currentUser.name.middleInitial + '. ' : ''}${currentUser.name.lastName}${currentUser.name.extension ? ' ' + currentUser.name.extension : ''}`
            : 'Unknown User';

        // Create request object
        const request = {
            id: Date.now(), // Simple ID generation
            userName: userName,
            userEmail: currentUser?.email || '',
            departmentId: this.selectedDepartment,
            departmentName: department.name,
            serviceId: this.selectedDocumentType,
            serviceName: service.name,
            serviceType: service.type,
            notes: this.additionalNotes,
            status: 'Pending',
            dateRequested: new Date().toISOString(),
            processingTime: service.processingTime,
            fee: service.fee
        };

        // Save to localStorage (in a real app, this would be an API call)
        const existingRequests = JSON.parse(localStorage.getItem('document_requests') || '[]');
        existingRequests.push(request);
        localStorage.setItem('document_requests', JSON.stringify(existingRequests));

        // Show success message
        await this.showToast(`Request submitted successfully! Your ${service.name} request is now being processed.`, 'success');

        // Reset form
        this.resetForm();
    }

    resetForm() {
        this.selectedDepartment = null;
        this.selectedDocumentType = null;
        this.additionalNotes = '';
        this.availableServices = [];
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
