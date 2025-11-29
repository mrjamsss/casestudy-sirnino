import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Department, MasterService, DepartmentCategory } from '../department.interface';

interface SelectableService extends MasterService {
  selected: boolean;
}

@Component({
  selector: 'app-department-modal',
  templateUrl: './department-modal.component.html',
  styleUrls: ['./department-modal.component.scss'],
  standalone: false
})
export class DepartmentModalComponent implements OnInit {
  @Input() departmentData?: Department;
  @Input() masterServices: MasterService[] = [];
  @Input() categories: DepartmentCategory[] = [];

  formData: Department = {
    id: 0,
    name: '',
    description: '',
    head: '',
    contact: '',
    location: '',
    category: '',
    status: 'Draft',
    services: []
  };

  availableServices: SelectableService[] = [];

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    // Initialize form data
    if (this.departmentData) {
      this.formData = { ...this.departmentData };
    }

    // Set default category icon if category is selected
    if (this.formData.category && !this.formData.icon) {
      this.onCategoryChange();
    }

    // Initialize available services with selection state
    this.availableServices = this.masterServices
      .filter(s => s.isActive)
      .map(service => ({
        ...service,
        selected: this.formData.services.some(s => s.id === service.id)
      }));
  }

  onCategoryChange() {
    const category = this.categories.find(c => c.name === this.formData.category);
    if (category) {
      this.formData.icon = category.icon;
    }
  }

  toggleAllServices() {
    const allSelected = this.allServicesSelected;
    this.availableServices.forEach(service => {
      service.selected = !allSelected;
    });
  }

  get allServicesSelected(): boolean {
    return this.availableServices.length > 0 &&
      this.availableServices.every(s => s.selected);
  }

  get selectedServicesCount(): number {
    return this.availableServices.filter(s => s.selected).length;
  }

  getSelectedServiceNames(): string {
    return this.availableServices
      .filter(s => s.selected)
      .map(s => s.name)
      .join(', ');
  }

  async viewServiceDetails(service: MasterService) {
    const requirements = service.requirements.map(r => r.name).join('\n• ');

    const alert = await this.alertCtrl.create({
      header: service.name,
      subHeader: `${service.type} • ${service.category}`,
      message: `
        <strong>Description:</strong><br>
        ${service.description || 'N/A'}<br><br>
        <strong>Requirements:</strong><br>
        • ${requirements}<br><br>
        <strong>Processing Time:</strong> ${service.processingTime}<br>
        <strong>Fee:</strong> ₱${service.fee.toFixed(2)}
      `,
      buttons: ['Close']
    });

    await alert.present();
  }

  isFormValid(): boolean {
    return !!(
      this.formData.name &&
      this.formData.description &&
      this.formData.head &&
      this.formData.contact &&
      this.formData.location &&
      this.formData.category &&
      this.formData.status
    );
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    if (!this.isFormValid()) {
      return;
    }

    // Update services based on selection
    this.formData.services = this.availableServices
      .filter(s => s.selected)
      .map(s => {
        const { selected, ...service } = s;
        return service;
      });

    this.modalCtrl.dismiss(this.formData, 'confirm');
  }
}
