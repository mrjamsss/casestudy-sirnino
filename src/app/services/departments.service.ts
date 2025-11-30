import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Department, Service } from '../shared/models/department.interface';

@Injectable({
    providedIn: 'root'
})
export class DepartmentsService {
    private readonly STORAGE_KEY = 'departments_data';
    private departmentsSubject = new BehaviorSubject<Department[]>([]);

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage() {
        const storedData = localStorage.getItem(this.STORAGE_KEY);
        if (storedData) {
            this.departmentsSubject.next(JSON.parse(storedData));
        } else {
            // Default initial data
            const defaultData: Department[] = [
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
            this.departmentsSubject.next(defaultData);
            this.saveToStorage(defaultData);
        }
    }

    private saveToStorage(data: Department[]) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    getDepartments(): Observable<Department[]> {
        return this.departmentsSubject.asObservable();
    }

    addDepartment(department: Department) {
        const current = this.departmentsSubject.value;
        const updated = [...current, department];
        this.departmentsSubject.next(updated);
        this.saveToStorage(updated);
    }

    updateDepartment(updatedDepartment: Department) {
        const current = this.departmentsSubject.value;
        const index = current.findIndex(d => d.id === updatedDepartment.id);
        if (index !== -1) {
            current[index] = updatedDepartment;
            const updated = [...current];
            this.departmentsSubject.next(updated);
            this.saveToStorage(updated);
        }
    }

    deleteDepartment(id: number) {
        const current = this.departmentsSubject.value;
        const updated = current.filter(d => d.id !== id);
        this.departmentsSubject.next(updated);
        this.saveToStorage(updated);
    }

    addService(departmentId: number, service: Service) {
        const current = this.departmentsSubject.value;
        const dept = current.find(d => d.id === departmentId);
        if (dept) {
            dept.services.push(service);
            const updated = [...current];
            this.departmentsSubject.next(updated);
            this.saveToStorage(updated);
        }
    }

    updateService(departmentId: number, updatedService: Service) {
        const current = this.departmentsSubject.value;
        const dept = current.find(d => d.id === departmentId);
        if (dept) {
            const index = dept.services.findIndex(s => s.id === updatedService.id);
            if (index !== -1) {
                dept.services[index] = updatedService;
                const updated = [...current];
                this.departmentsSubject.next(updated);
                this.saveToStorage(updated);
            }
        }
    }

    deleteService(departmentId: number, serviceId: number) {
        const current = this.departmentsSubject.value;
        const dept = current.find(d => d.id === departmentId);
        if (dept) {
            dept.services = dept.services.filter(s => s.id !== serviceId);
            const updated = [...current];
            this.departmentsSubject.next(updated);
            this.saveToStorage(updated);
        }
    }
}
