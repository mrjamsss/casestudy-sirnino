import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Department } from '../department.interface';

@Component({
  selector: 'app-department-modal',
  templateUrl: './department-modal.component.html',
  styleUrls: ['./department-modal.component.scss'],
  standalone: false
})
export class DepartmentModalComponent implements OnInit {
  @Input() departmentData?: Department;

  formData: Partial<Department> = {
    name: '',
    description: ''
  };

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    if (this.departmentData) {
      this.formData = {
        name: this.departmentData.name,
        description: this.departmentData.description
      };
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.modalCtrl.dismiss(this.formData, 'confirm');
  }

  isFormValid(): boolean {
    return !!(this.formData.name && this.formData.description);
  }
}
