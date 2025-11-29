import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MasterService, DepartmentCategory, Requirement } from '../department.interface';

@Component({
  selector: 'app-service-modal',
  templateUrl: './service-modal.component.html',
  styleUrls: ['./service-modal.component.scss'],
  standalone: false
})
export class ServiceModalComponent implements OnInit {
  @Input() serviceData?: MasterService;
  @Input() categories: DepartmentCategory[] = [];

  formData: MasterService = {
    id: 0,
    name: '',
    type: 'Certificate',
    category: '',
    description: '',
    requirements: [],
    processingTime: '',
    fee: 0,
    isActive: true
  };

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    if (this.serviceData) {
      this.formData = {
        ...this.serviceData,
        requirements: [...this.serviceData.requirements] // Deep copy
      };
    }
  }

  addRequirement() {
    this.formData.requirements.push({
      id: Date.now(), // Temporary ID
      name: ''
    });
  }

  removeRequirement(index: number) {
    this.formData.requirements.splice(index, 1);
  }

  isFormValid(): boolean {
    const hasValidRequirements = this.formData.requirements.every(r => r.name.trim() !== '');

    return !!(
      this.formData.name &&
      this.formData.type &&
      this.formData.category &&
      this.formData.processingTime &&
      this.formData.fee >= 0 &&
      hasValidRequirements
    );
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    if (!this.isFormValid()) {
      return;
    }

    // Clean up empty requirements
    this.formData.requirements = this.formData.requirements.filter(r => r.name.trim() !== '');

    this.modalCtrl.dismiss(this.formData, 'confirm');
  }
}
