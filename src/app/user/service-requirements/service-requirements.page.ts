import { Component, OnInit } from '@angular/core';
import { DepartmentsService } from '../../services/departments.service';
import { Department } from '../../shared/models/department.interface';

@Component({
    selector: 'app-service-requirements',
    templateUrl: './service-requirements.page.html',
    styleUrls: ['./service-requirements.page.scss'],
    standalone: false
})
export class ServiceRequirementsPage implements OnInit {

    departments: Department[] = [];

    constructor(private departmentsService: DepartmentsService) { }

    ngOnInit() {
        this.departmentsService.getDepartments().subscribe(data => {
            this.departments = data;
        });
    }

}
