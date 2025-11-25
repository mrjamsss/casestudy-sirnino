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
  isDarkMode: boolean = false;
  requestForm!: FormGroup;
  feeCalculatorForm!: FormGroup;
  calculatedFee: number | null = null;
  feeBreakdown: string = '';
  selectedService: ServiceDetail | null = null;
  selectedTransactionDetail: any = null;
  transactionTab: string = 'documents';
  faqSearchQuery: string = '';
  filteredFAQs: any[] = [];
  accountForm!: FormGroup;
  accountStatus = {
    type: 'Citizen',
    memberSince: new Date('2023-01-15'),
  };
  documentRequestsList: any[] = [];
  allTransactionsList: any[] = [];
  faqs: any[] = [];
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

    this.accountForm = this.formBuilder.group({
      fullName: ['Juan Dela Cruz', Validators.required],
      email: ['juan@example.com', [Validators.required, Validators.email]],
      contactNumber: ['+63 9XX XXX XXXX', Validators.required],
      address: ['123 Cabanatuan St., City, Nueva Ecija', Validators.required],
    });

    // Initialize transaction data
    this.documentRequestsList = [
      {
        id: 'REQ-001',
        documentType: 'Birth Certificate',
        department: 'Civil Registry',
        requestDate: new Date('2024-11-01'),
        status: 'processing',
        notes: 'Awaiting verification of documents',
      },
      {
        id: 'REQ-002',
        documentType: 'Business Permit',
        department: 'Business Permits Office',
        requestDate: new Date('2024-10-15'),
        status: 'completed',
        notes: 'Ready for pickup at City Hall',
      },
    ];

    this.allTransactionsList = [
      {
        id: 'TRX-001',
        type: 'Document Request',
        title: 'Birth Certificate',
        department: 'Civil Registry',
        date: new Date('2024-11-01'),
        status: 'processing',
        amount: 150.00,
        notes: 'Awaiting verification of documents',
      },
      {
        id: 'TRX-002',
        type: 'Document Request',
        title: 'Business Permit',
        department: 'Business Permits Office',
        date: new Date('2024-10-15'),
        status: 'completed',
        amount: 5000.00,
        notes: 'Ready for pickup at City Hall',
      },
      {
        id: 'TRX-003',
        type: 'Fee Payment',
        title: 'Permit Fee',
        department: 'Treasurer Office',
        date: new Date('2024-10-14'),
        status: 'completed',
        amount: 5000.00,
        notes: 'Payment for business permit application',
      },
    ];

    // Initialize FAQs
    this.faqs = [
      {
        question: 'How long does it take to process a birth certificate?',
        answer: 'Birth certificates typically take 3-5 business days to process. You will receive a notification when your document is ready for pickup.',
        category: 'Documents',
      },
      {
        question: 'What documents do I need to apply for a business permit?',
        answer: 'You will need DTI/SEC Registration, Barangay Clearance, Mayor\'s Permit Application, and Tax Identification Number.',
        category: 'Business',
      },
      {
        question: 'Can I renew my business permit online?',
        answer: 'Currently, all permit renewals must be done in person at City Hall. Visit our office during business hours (Mon-Fri, 8:00 AM - 5:00 PM).',
        category: 'Business',
      },
      {
        question: 'What is the fee for a community tax certificate?',
        answer: 'A community tax certificate costs ₱100 and can be processed in just 1 business day.',
        category: 'Fees',
      },
      {
        question: 'How do I track my document request?',
        answer: 'You can track your request in the Transaction History section of your dashboard. You will also receive email notifications for status updates.',
        category: 'Documents',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept cash and bank transfers. Please visit the Treasurer\'s Office for payment details.',
        category: 'Payments',
      },
    ];

    this.filteredFAQs = this.faqs;
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

  filterFAQs() {
    const query = this.faqSearchQuery.toLowerCase();
    if (!query) {
      this.filteredFAQs = this.faqs;
    } else {
      this.filteredFAQs = this.faqs.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query)
      );
    }
  }

  saveAccountChanges() {
    if (this.accountForm.valid) {
      const formData = this.accountForm.value;
      console.log('Saving account changes:', formData);
      // Implement actual save logic here
    }
  }

  changePassword() {
    console.log('Change password initiated');
    // Implement password change logic
  }

  toggleTwoFactor() {
    console.log('Two-factor authentication toggled');
    // Implement 2FA logic
  }

  deactivateAccount() {
    console.log('Account deactivation initiated');
    // Implement account deactivation logic
  }

  logout() {
    this.router.navigate(['/home']);
  }

  showTransactionDetail(transaction: any) {
    this.selectedTransactionDetail = transaction;
  }

  closeTransactionDetail() {
    this.selectedTransactionDetail = null;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }
}

