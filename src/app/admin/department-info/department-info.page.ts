import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Department, Service } from '../../shared/models/department.interface';
import { ServiceModalComponent } from './service-modal/service-modal.component';
import { DepartmentModalComponent } from './department-modal/department-modal.component';
import { DepartmentsService } from '../../services/departments.service';

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
        private alertCtrl: AlertController,
        private departmentsService: DepartmentsService
    ) { }

    ngOnInit() {
        this.departmentsService.getDepartments().subscribe(data => {
            this.departments = data;
        });
    }

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
            this.departmentsService.addService(dept.id, newService);
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
            const updatedService = { ...service, ...data };
            this.departmentsService.updateService(dept.id, updatedService);
        }
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
            this.departmentsService.addDepartment(newDept);
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
            const updatedDept = { ...dept, name: data.name, description: data.description };
            this.departmentsService.updateDepartment(updatedDept);
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
                        this.departmentsService.deleteService(dept.id, service.id);
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
                        this.departmentsService.deleteDepartment(dept.id);
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
