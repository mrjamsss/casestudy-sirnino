import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Service } from '../department.interface';

@Component({
  selector: 'app-service-modal',
  templateUrl: './service-modal.component.html',
  styleUrls: ['./service-modal.component.scss'],
  standalone: false
})
export class ServiceModalComponent implements OnInit {
  @Input() serviceData?: Service;

  formData: any = {
    name: '',
    type: 'Certificate',
    requirements: [],
    processingTime: '',
    fee: 0
  };

  customPopoverOptions: any = {
    cssClass: 'smooth-dropdown-popover'
  };

  // Helper for form array
  requirementsList: { selectValue: string; customValue: string }[] = [];

  predefinedRequirements: string[] = [
    'Valid ID',
    'Barangay Clearance',
    'Cedula (Community Tax Certificate)',
    'PSA Birth Certificate',
    'Marriage Contract',
    '2x2 Picture',
    'Application Form',
    'Official Receipt',
    'Health Certificate',
    'Police Clearance',
    'DTI Registration',
    'Fire Safety Inspection Certificate',
    'Sanitary Permit',
    'Zoning Clearance'
  ];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    if (this.serviceData) {
      this.formData = {
        ...this.serviceData
      };

      // Convert string[] to object array for the form
      this.requirementsList = this.serviceData.requirements.map(req => {
        const isPredefined = this.predefinedRequirements.includes(req);
        return {
          selectValue: isPredefined ? req : 'Other',
          customValue: isPredefined ? '' : req
        };
      });
    }
  }

  addRequirement() {
    this.requirementsList.push({ selectValue: '', customValue: '' });
  }

  removeRequirement(index: number) {
    this.requirementsList.splice(index, 1);
  }

  isFormValid(): boolean {
    const hasValidRequirements = this.requirementsList.every(req => {
      if (req.selectValue === 'Other') {
        return req.customValue.trim() !== '';
      }
      return req.selectValue !== '';
    });

    return !!(
      this.formData.name &&
      this.formData.type &&
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

    // Convert object array back to string[]
    const finalRequirements = this.requirementsList
      .map(req => {
        if (req.selectValue === 'Other') {
          return req.customValue.trim();
        }
        return req.selectValue;
      })
      .filter(r => r !== '');

    const result: Service = {
      ...this.formData,
      requirements: finalRequirements
    };

    this.modalCtrl.dismiss(result, 'confirm');
  }
}
