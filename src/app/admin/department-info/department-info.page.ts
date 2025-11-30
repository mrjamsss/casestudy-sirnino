import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Department, Service } from './department.interface';
import { ServiceModalComponent } from './service-modal/service-modal.component';
import { DepartmentModalComponent } from './department-modal/department-modal.component';

@Component({
    selector: 'app-department-info',
    templateUrl: './department-info.page.html',
    styleUrls: ['./department-info.page.scss'],
    standalone: false
})
export class DepartmentInfoPage implements OnInit {
    departments: Department[] = [];

    constructor(
        private modalCtrl: ModalController,
        private alertCtrl: AlertController
    ) { }

    ngOnInit() {
        this.loadMockData();
    }
    // ... (keep loadMockData and other methods)

    async addNewService(dept: Department) {
        const modal = await this.modalCtrl.create({
            component: ServiceModalComponent,
            cssClass: 'small-modal'
        });

        await modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm' && data) {
            const newService: Service = {
                ...data,
                id: this.getNextServiceId()
            };
            dept.services.push(newService);
        }
    }

    async editService(dept: Department, service: Service) {
        const modal = await this.modalCtrl.create({
            component: ServiceModalComponent,
            componentProps: {
                serviceData: service
            },
            cssClass: 'small-modal'
        });

        await modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm' && data) {
            // Update service properties
            service.name = data.name;
            service.type = data.type;
            service.requirements = data.requirements;
            service.processingTime = data.processingTime;
            service.fee = data.fee;
        }
    }

    loadMockData() {
        this.departments = [
            {
                id: 1,
                name: 'Civil Registry',
                description: 'Handles birth, marriage, and death certificates',
                services: [
                    {
                        id: 1,
                        name: 'Birth Certificate',
                        type: 'Certificate',
                        requirements: ['Valid ID', 'Payment Receipt', 'PSA Form'],
                        processingTime: '3-5 business days',
                        fee: 150.00
                    },
                    {
                        id: 2,
                        name: 'Marriage Certificate',
                        type: 'Certificate',
                        requirements: ['Valid ID', 'Payment Receipt'],
                        processingTime: '3-5 business days',
                        fee: 150.00
                    }
                ]
            },
            {
                id: 2,
                name: 'Business Permits Office',
                description: 'Issues and renews business permits',
                services: [
                    {
                        id: 3,
                        name: 'New Business Permit',
                        type: 'Permit',
                        requirements: ['DTI Registration', 'Barangay Clearance', 'Fire Safety Certificate'],
                        processingTime: '7-10 business days',
                        fee: 500.00
                    },
                    {
                        id: 4,
                        name: 'Business Permit Renewal',
                        type: 'Permit',
                        requirements: ['Previous Permit', 'Updated Documents'],
                        processingTime: '5-7 business days',
                        fee: 300.00
                    }
                ]
            },
            {
                id: 3,
                name: 'Treasury Office',
                description: 'Handles tax payments and assessments',
                services: [
                    {
                        id: 5,
                        name: 'Real Property Tax Payment',
                        type: 'Payment',
                        requirements: ['Tax Declaration', 'Valid ID'],
                        processingTime: '1-2 business days',
                        fee: 0
                    }
                ]
            },
            {
                id: 4,
                name: 'Health Office',
                description: 'Medical certificates and health permits',
                services: [
                    {
                        id: 6,
                        name: 'Health Certificate',
                        type: 'Certificate',
                        requirements: ['Valid ID', '2x2 Photo', 'Medical Exam Results'],
                        processingTime: '1-2 business days',
                        fee: 100.00
                    }
                ]
            }
        ];
    }

    async addNewDepartment() {
        const modal = await this.modalCtrl.create({
            component: DepartmentModalComponent,
            cssClass: 'small-modal'
        });

        await modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm' && data) {
            const newDept: Department = {
                id: this.getNextDepartmentId(),
                name: data.name,
                description: data.description,
                services: []
            };
            this.departments.push(newDept);
        }
    }

    async editDepartment(dept: Department) {
        const modal = await this.modalCtrl.create({
            component: DepartmentModalComponent,
            componentProps: {
                departmentData: dept
            },
            cssClass: 'small-modal'
        });

        await modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm' && data) {
            dept.name = data.name;
            dept.description = data.description;
        }
    }


    async deleteService(dept: Department, service: Service) {
        const alert = await this.alertCtrl.create({
            header: 'Delete Service',
            message: `Are you sure you want to delete "${service.name}"?`,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        dept.services = dept.services.filter(s => s.id !== service.id);
                    }
                }
            ]
        });

        await alert.present();
    }

    async deleteDepartment(dept: Department) {
        const alert = await this.alertCtrl.create({
            header: 'Delete Department',
            message: `Are you sure you want to delete "${dept.name}" and all its services?`,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        this.departments = this.departments.filter(d => d.id !== dept.id);
                    }
                }
            ]
        });

        await alert.present();
    }

    getTotalServices(): number {
        return this.departments.reduce((total, dept) => total + dept.services.length, 0);
    }

    getServiceTypeBadgeColor(type: string): string {
        switch (type) {
            case 'Certificate': return 'primary';
            case 'Permit': return 'success';
            case 'Payment': return 'warning';
            default: return 'medium';
        }
    }

    private getNextDepartmentId(): number {
        return this.departments.length > 0
            ? Math.max(...this.departments.map(d => d.id)) + 1
            : 1;
    }

    private getNextServiceId(): number {
        const allServices: Service[] = [];
        this.departments.forEach((d: Department) => {
            allServices.push(...d.services);
        });
        return allServices.length > 0
            ? Math.max(...allServices.map((s: Service) => s.id)) + 1
            : 1;
    }
}
