import { Component, OnInit } from '@angular/core';

interface DocumentRequest {
  id: string;
  user: string;
  documentType: string;
  department: string;
  date: string;
  status: 'pending' | 'processing' | 'completed';
}

interface CertificateTemplate {
  name: string;
  color: string;
}

@Component({
  selector: 'app-request-management',
  templateUrl: './request-management.page.html',
  styleUrls: ['./request-management.page.scss'],
  standalone: false
})
export class RequestManagementPage implements OnInit {
  selectedOffice = 'Civil Registry';
  showTemplateModal = false;
  
  offices = [
    'Civil Registry',
    'Business Permits and Licensing Office',
    'Treasury Office',
    'Health Office'
  ];

  certificateTemplates: { [key: string]: CertificateTemplate[] } = {
    'Civil Registry': [
      { name: 'Birth Certificate', color: 'success' },
      { name: 'Marriage Certificate', color: 'primary' },
      { name: 'Death Certificate', color: 'warning' }
    ],
    'Business Permits and Licensing Office': [
      { name: 'Business Permit', color: 'success' }
    ],
    'Treasury Office': [
      { name: 'Tax Clearance Certificate', color: 'primary' }
    ],
    'Health Office': [
      { name: 'Health Certificate', color: 'success' }
    ]
  };

  pendingCount = 3;
  approvedCount = 14;
  readyCount = 0;

  selectedDocumentType = '';
  selectedDepartment = '';
  selectedDate = '';
  searchId = '';

  documentTypes = [
    'Birth Certificate',
    'Marriage Certificate',
    'Death Certificate',
    'Business Permit',
    'Barangay Clearance',
    'Residency Certificate',
    'Health Certificate'
  ];

  departments = [
    'Civil Registry',
    'Business Permits Office',
    'Treasury Office',
    'Health Office',
    'Barangay Affairs'
  ];

  requests: DocumentRequest[] = [
    {
      id: 'REQ001',
      user: 'Juan dela Cruz',
      documentType: 'Birth Certificate',
      department: 'Civil Registry',
      date: '01/11/2024',
      status: 'processing'
    },
    {
      id: 'REQ002',
      user: 'Juan dela Cruz',
      documentType: 'Business Permit',
      department: 'Business Permits Office',
      date: '15/10/2024',
      status: 'completed'
    },
    {
      id: 'REQ003',
      user: 'Maria Santos',
      documentType: 'Barangay Clearance',
      department: 'Barangay Affairs',
      date: '10/11/2024',
      status: 'pending'
    }
  ];

  filteredRequests: DocumentRequest[] = [...this.requests];

  constructor() {}

  ngOnInit() {
    // Initialize component
  }

  openTemplateModal() {
    this.showTemplateModal = true;
    this.selectedOffice = 'Civil Registry'; // Reset to default
  }

  closeTemplateModal() {
    this.showTemplateModal = false;
  }

  searchRequests() {
    this.filteredRequests = this.requests.filter(req => {
      const matchesId = this.searchId ? req.id.toLowerCase().includes(this.searchId.toLowerCase()) : true;
      const matchesType = this.selectedDocumentType ? req.documentType === this.selectedDocumentType : true;
      const matchesDept = this.selectedDepartment ? req.department === this.selectedDepartment : true;
      
      return matchesId && matchesType && matchesDept;
    });
  }

  viewRequest(request: DocumentRequest) {
    console.log('View request:', request);
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'completed': return 'success';
      case 'processing': return 'primary';
      case 'pending': return 'warning';
      default: return 'medium';
    }
  }

  getDisplayedTemplates() {
    return this.certificateTemplates[this.selectedOffice] || [];
  }

  createNewCertificate(templateName: string) {
    console.log('Create new:', templateName);
    // Close modal after selection
    this.closeTemplateModal();
  }

  viewTemplate(templateName: string) {
    console.log('View template:', templateName);
  }
}