import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Department, Service } from './department.interface';

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
        const alert = await this.alertCtrl.create({
            header: 'Add New Department',
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    placeholder: 'Department Name'
                },
                {
                    name: 'description',
                    type: 'textarea',
                    placeholder: 'Description'
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
                        if (data.name && data.description) {
                            const newDept: Department = {
                                id: this.getNextDepartmentId(),
                                name: data.name,
                                description: data.description,
                                services: []
                            };
                            this.departments.push(newDept);
                            return true;
                        }
                        return false;
                    }
                }
            ]
        });

        await alert.present();
    }

    async editDepartment(dept: Department) {
        const alert = await this.alertCtrl.create({
            header: 'Edit Department',
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    placeholder: 'Department Name',
                    value: dept.name
                },
                {
                    name: 'description',
                    type: 'textarea',
                    placeholder: 'Description',
                    value: dept.description
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Save',
                    handler: (data) => {
                        if (data.name && data.description) {
                            dept.name = data.name;
                            dept.description = data.description;
                            return true;
                        }
                        return false;
                    }
                }
            ]
        });

        await alert.present();
    }

    async addNewService(dept: Department) {
        const alert = await this.alertCtrl.create({
            header: 'Add New Service',
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    placeholder: 'Service Name'
                },
                {
                    name: 'type',
                    type: 'text',
                    placeholder: 'Type (Certificate/Permit/Payment)'
                },
                {
                    name: 'requirements',
                    type: 'textarea',
                    placeholder: 'Requirements (comma-separated)'
                },
                {
                    name: 'processingTime',
                    type: 'text',
                    placeholder: 'Processing Time'
                },
                {
                    name: 'fee',
                    type: 'number',
                    placeholder: 'Fee'
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
                        if (data.name && data.type) {
                            const newService: Service = {
                                id: this.getNextServiceId(),
                                name: data.name,
                                type: data.type as 'Certificate' | 'Permit' | 'Payment',
                                requirements: data.requirements ? data.requirements.split(',').map((r: string) => r.trim()) : [],
                                processingTime: data.processingTime || 'N/A',
                                fee: parseFloat(data.fee) || 0
                            };
                            dept.services.push(newService);
                            return true;
                        }
                        return false;
                    }
                }
            ]
        });

        await alert.present();
    }

    async editService(dept: Department, service: Service) {
        const alert = await this.alertCtrl.create({
            header: 'Edit Service',
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    placeholder: 'Service Name',
                    value: service.name
                },
                {
                    name: 'type',
                    type: 'text',
                    placeholder: 'Type',
                    value: service.type
                },
                {
                    name: 'requirements',
                    type: 'textarea',
                    placeholder: 'Requirements (comma-separated)',
                    value: service.requirements.join(', ')
                },
                {
                    name: 'processingTime',
                    type: 'text',
                    placeholder: 'Processing Time',
                    value: service.processingTime
                },
                {
                    name: 'fee',
                    type: 'number',
                    placeholder: 'Fee',
                    value: service.fee.toString()
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Save',
                    handler: (data) => {
                        if (data.name && data.type) {
                            service.name = data.name;
                            service.type = data.type;
                            service.requirements = data.requirements ? data.requirements.split(',').map((r: string) => r.trim()) : [];
                            service.processingTime = data.processingTime;
                            service.fee = parseFloat(data.fee) || 0;
                            return true;
                        }
                        return false;
                    }
                }
            ]
        });

        await alert.present();
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
