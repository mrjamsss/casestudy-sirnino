import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface ServiceDetail {
  name: string;
  type: 'Certificate' | 'Permit';
  requiredDocuments: string[];
  processingTime: string;
  fee: number;
}

interface CommunityProgram {
  title: string;
  description: string;
  department: string;
  schedule: {
    start: string;
    end?: string;
  };
  contact: {
    person: string;
    phone: string;
  };
  status: 'active' | 'upcoming' | 'completed';
}

@Component({
  selector: 'app-citizen-portal',
  templateUrl: 'citizen-portal.page.html',
  styleUrls: ['citizen-portal.page.scss'],
  standalone: false,
})
export class CitizenPortalPage implements OnInit {
  activeRoute: string = 'dashboard';
  isSidebarCollapsed: boolean = false;
  requestForm!: FormGroup;
  feeCalculatorForm!: FormGroup;
  calculatedFee: number | null = null;
  feeBreakdown: string = '';
  selectedService: ServiceDetail | null = null;
  communityPrograms: {
    active: CommunityProgram[];
    upcoming: CommunityProgram[];
  } = {
    active: [
      {
        title: 'Free Medical Check-up Program',
        description: 'Free medical consultations and basic laboratory tests for senior citizens and PWDs.',
        department: 'Health Office',
        schedule: {
          start: '2024-11-15',
          end: '2024-11-30',
        },
        contact: {
          person: 'Dr. Maria Reyes',
          phone: '044-123-4567',
        },
        status: 'active',
      },
    ],
    upcoming: [
      {
        title: 'Community Clean-Up Drive',
        description: 'Barangay-wide clean-up and waste segregation drive.',
        department: 'Environment Office',
        schedule: {
          start: '2024-12-05',
        },
        contact: {
          person: 'Engr. Carlo Santos',
          phone: '044-765-4321',
        },
        status: 'upcoming',
      },
      {
        title: 'Youth Skills Training',
        description: 'Free digital literacy and job readiness workshop for youth.',
        department: 'Youth and Sports Office',
        schedule: {
          start: '2025-01-10',
          end: '2025-01-12',
        },
        contact: {
          person: 'Ms. Liza Dizon',
          phone: '044-222-8899',
        },
        status: 'upcoming',
      },
    ],
  };

  serviceDetails: { [key: string]: ServiceDetail } = {
    'birth-certificate': {
      name: 'Birth Certificate',
      type: 'Certificate',
      requiredDocuments: ['Valid ID', 'Payment Receipt', 'PSA Form'],
      processingTime: '3-5 business days',
      fee: 150.0,
    },
    'marriage-certificate': {
      name: 'Marriage Certificate',
      type: 'Certificate',
      requiredDocuments: ['Valid ID', 'Payment Receipt', 'PSA Form', 'Marriage Contract'],
      processingTime: '3-5 business days',
      fee: 150.0,
    },
    'death-certificate': {
      name: 'Death Certificate',
      type: 'Certificate',
      requiredDocuments: ['Valid ID', 'Payment Receipt', 'PSA Form', 'Death Certificate from Hospital'],
      processingTime: '3-5 business days',
      fee: 150.0,
    },
    'new-business-permit': {
      name: 'New Business Permit',
      type: 'Permit',
      requiredDocuments: ['DTI/SEC Registration', 'Barangay Clearance', "Mayor's Permit Application", 'Tax Identification Number'],
      processingTime: '7-14 business days',
      fee: 5000.0,
    },
    'business-permit-renewal': {
      name: 'Business Permit Renewal',
      type: 'Permit',
      requiredDocuments: ['Previous Business Permit', 'Updated Financial Statement', 'Tax Clearance'],
      processingTime: '5-7 business days',
      fee: 2500.0,
    },
    'tax-certificate': {
      name: 'Tax Certificate',
      type: 'Certificate',
      requiredDocuments: ['Valid ID', 'Property Tax Payment Receipt'],
      processingTime: '2-3 business days',
      fee: 100.0,
    },
    'community-tax-certificate': {
      name: 'Community Tax Certificate',
      type: 'Certificate',
      requiredDocuments: ['Valid ID'],
      processingTime: '1 business day',
      fee: 100.0,
    },
    'building-permit': {
      name: 'Building Permit',
      type: 'Permit',
      requiredDocuments: ['Land Title', 'Building Plans', 'Structural Design', 'Electrical Plans'],
      processingTime: '10-15 business days',
      fee: 0,
    },
    'electrical-permit': {
      name: 'Electrical Permit',
      type: 'Permit',
      requiredDocuments: ["Building Permit", "Electrical Plans", "Electrical Engineer's Certificate"],
      processingTime: '5-7 business days',
      fee: 500.0,
    },
    'plumbing-permit': {
      name: 'Plumbing Permit',
      type: 'Permit',
      requiredDocuments: ["Building Permit", 'Plumbing Plans', "Plumber's License"],
      processingTime: '5-7 business days',
      fee: 500.0,
    },
    'sanitary-permit': {
      name: 'Sanitary Permit',
      type: 'Permit',
      requiredDocuments: ['Business Permit', 'Health Certificate', 'Sanitation Inspection Report'],
      processingTime: '3-5 business days',
      fee: 500.0,
    },
    'health-certificate': {
      name: 'Health Certificate',
      type: 'Certificate',
      requiredDocuments: ['Valid ID', 'Medical Examination Result', '2x2 Photo'],
      processingTime: '2-3 business days',
      fee: 200.0,
    },
    'property-assessment': {
      name: 'Property Assessment',
      type: 'Certificate',
      requiredDocuments: ['Land Title', 'Tax Declaration', 'Property Survey'],
      processingTime: '5-7 business days',
      fee: 500.0,
    },
    'tax-declaration': {
      name: 'Tax Declaration',
      type: 'Certificate',
      requiredDocuments: ['Land Title', 'Property Survey', 'Transfer Certificate of Title'],
      processingTime: '5-7 business days',
      fee: 300.0,
    },
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.requestForm = this.formBuilder.group({
      department: ['', Validators.required],
      documentType: ['', Validators.required],
      additionalNotes: [''],
    });

    this.feeCalculatorForm = this.formBuilder.group({
      permitType: ['', Validators.required],
      cost: ['', [Validators.required, Validators.min(0)]],
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  navigateTo(route: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.activeRoute = route;
    console.log(`Navigate to ${route}`);
  }

  viewAllRequests() {
    console.log('View All Requests');
  }

  submitRequest() {
    if (this.requestForm.valid) {
      const formData = this.requestForm.value;
      console.log('Submitting request:', formData);
      this.requestForm.reset();
    }
  }

  calculateFee() {
    if (this.feeCalculatorForm.valid) {
      const permitType = this.feeCalculatorForm.value.permitType;
      const cost = parseFloat(this.feeCalculatorForm.value.cost) || 0;
      let fee = 0;
      let breakdown = '';

      switch (permitType) {
        case 'new-business':
          fee = 5000 + cost * 0.01;
          breakdown = `Base fee: ₱5,000 + 1% of capital (₱${(cost * 0.01).toFixed(2)})`;
          break;
        case 'business-renewal':
          fee = 2500 + cost * 0.005;
          breakdown = `Base fee: ₱2,500 + 0.5% of capital (₱${(cost * 0.005).toFixed(2)})`;
          break;
        case 'building':
          fee = cost * 0.02;
          breakdown = '2% of project cost';
          break;
        case 'sanitary':
          fee = 500;
          breakdown = 'Flat rate';
          break;
        default:
          fee = 0;
      }

      this.calculatedFee = fee;
      this.feeBreakdown = breakdown;
    }
  }

  showServiceDetails(serviceKey: string) {
    this.selectedService = this.serviceDetails[serviceKey] || null;
  }

  closeServiceDetails() {
    this.selectedService = null;
  }

  logout() {
    this.router.navigate(['/home']);
  }
}

