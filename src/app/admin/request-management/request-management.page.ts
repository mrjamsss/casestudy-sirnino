import { Component, OnInit } from '@angular/core';

interface DocumentRequest {
  id: string;
  user: string;
  documentType: string;
  department: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected' | 'ready';
  purpose?: string;
  details?: string;
  dateRequested?: string;
}

interface CertificateTemplate {
  name: string;
  color: string;
}

interface BirthCertificateData {
  registryNo: string;
  province: string;
  cityMunicipality: string;
  childFirstName: string;
  childMiddleName: string;
  childLastName: string;
  sex: string;
  dateOfBirthDay: string;
  dateOfBirthMonth: string;
  dateOfBirthYear: string;
  placeOfBirthName: string;
  placeOfBirthCity: string;
  placeOfBirthProvince: string;
  typeOfBirth: string;
  multipleChildInfo: string;
  birthOrder: string;
  weightAtBirth: string;
  motherFirstName: string;
  motherMiddleName: string;
  motherLastName: string;
  motherCitizenship: string;
  motherReligion: string;
  motherTotalChildren: string;
  motherChildrenAlive: string;
  motherChildrenDead: string;
  motherOccupation: string;
  motherAge: string;
  motherResidenceHouse: string;
  motherResidenceCity: string;
  motherResidenceProvince: string;
  motherResidenceCountry: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherLastName: string;
  fatherCitizenship: string;
  fatherReligion: string;
  fatherOccupation: string;
  fatherAge: string;
  fatherResidenceHouse: string;
  fatherResidenceCity: string;
  fatherResidenceProvince: string;
  fatherResidenceCountry: string;
  marriageDate: string;
  marriagePlace: string;
  marriageProvince: string;
  marriageCountry: string;
  attendantType: string;
  attendantName: string;
  attendantTitle: string;
  attendantAddress: string;
  attendantDate: string;
  informantName: string;
  informantRelationship: string;
  informantAddress: string;
  informantDate: string;
  preparedByName: string;
  preparedByTitle: string;
  preparedByDate: string;
  receivedByName: string;
  receivedByTitle: string;
  receivedByDate: string;
  registeredByName: string;
  registeredByTitle: string;
  registeredByDate: string;
  remarks: string;
}

interface MarriageCertificateData {
  registryNo: string;
  province: string;
  cityMunicipality: string;
  husbandFirstName: string;
  husbandMiddleName: string;
  husbandLastName: string;
  husbandDateOfBirthDay: string;
  husbandDateOfBirthMonth: string;
  husbandDateOfBirthYear: string;
  husbandPlaceOfBirthCity: string;
  wifeFirstName: string;
  wifeMiddleName: string;
  wifeLastName: string;
  wifeDateOfBirthDay: string;
  wifeDateOfBirthMonth: string;
  wifeDateOfBirthYear: string;
  wifePlaceOfBirthCity: string;
  marriagePlaceCity: string;
  marriageDateDay: string;
  marriageDateMonth: string;
  marriageDateYear: string;
  marriageTimeOfMarriage: string;
  remarks: string;
  husbandSignature: string;
  wifeSignature: string;
  solemnizingOfficerName: string;
}

interface DeathCertificateData {
  province: string;
  registryNo: string;
  cityMunicipality: string;
  deceasedFirstName: string;
  deceasedMiddleName: string;
  deceasedLastName: string;
  sex: string;
  dateOfDeathDay: string;
  dateOfDeathMonth: string;
  dateOfDeathYear: string;
  timeOfDeath: string;
  ageYears: string;
  ageMonths: string;
  ageDays: string;
  dateOfBirthDay: string;
  dateOfBirthMonth: string;
  dateOfBirthYear: string;
  placeOfDeathName: string;
  placeOfDeathCity: string;
  placeOfDeathProvince: string;
  civilStatus: string;
  occupation: string;
  residenceHouse: string;
  residenceCity: string;
  residenceProvince: string;
  residenceCountry: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherLastName: string;
  motherFirstName: string;
  motherMiddleName: string;
  motherLastName: string;
  spouseFirstName: string;
  spouseMiddleName: string;
  spouseLastName: string;
  immediateCoD: string;
  antecedentCoD: string;
  underlyingCoD: string;
  otherConditions: string;
  mannerOfDeath: string;
  attendantType: string;
  attendantName: string;
  certifierSignature: string;
  certifierName: string;
  certifierTitle: string;
  remarks: string;
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
  showDetailsModal = false;
  showCreateTemplateModal = false;
  showViewTemplateModal = false;
  showBirthCertificateModal = false;
  showMarriageCertificateModal = false;
  showDeathCertificateModal = false;

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

  pendingCount = 0;
  approvedCount = 0;
  readyCount = 0;

  selectedDocumentType = '';
  selectedStatus = '';
  selectedDepartment = '';
  selectedDate = '';
  searchId = '';

  documentTypes = [
    'Birth Certificate',
    'Marriage Certificate',
    'Death Certificate',
    'Business Permit',
    'Tax Clearance Certificate',
    'Health Certificate'
  ];

  departments = [
    'Civil Registry',
    'Business Permits and Licensing Office',
    'Treasury Office',
    'Health Office'
  ];

  requests: DocumentRequest[] = [];
  filteredRequests: DocumentRequest[] = [];
  selectedRequest: DocumentRequest | null = null;

  // Template creation variables
  currentTemplateName: string = '';
  templateName: string = '';
  logoFile: File | null = null;
  headerText: string = '';
  bodyText: string = '';
  footerText: string = '';
  secretaryName: string = '';

  // Birth Certificate Data
  birthCertData: BirthCertificateData = this.getEmptyBirthCertData();

  // Marriage Certificate Data
  marriageCertData: MarriageCertificateData = this.getEmptyMarriageCertData();

  // Death Certificate Data
  deathCertData: DeathCertificateData = this.getEmptyDeathCertData();

  // Template storage
  savedTemplates: { [key: string]: any } = {};

  constructor() { }

  ngOnInit() {
    this.loadRequests();
    this.updateCounts();
    setInterval(() => {
      this.loadRequests();
      this.updateCounts();
    }, 5000);
  }

  getEmptyBirthCertData(): BirthCertificateData {
    return {
      registryNo: '',
      province: '',
      cityMunicipality: '',
      childFirstName: '',
      childMiddleName: '',
      childLastName: '',
      sex: '',
      dateOfBirthDay: '',
      dateOfBirthMonth: '',
      dateOfBirthYear: '',
      placeOfBirthName: '',
      placeOfBirthCity: '',
      placeOfBirthProvince: '',
      typeOfBirth: '',
      multipleChildInfo: '',
      birthOrder: '',
      weightAtBirth: '',
      motherFirstName: '',
      motherMiddleName: '',
      motherLastName: '',
      motherCitizenship: '',
      motherReligion: '',
      motherTotalChildren: '',
      motherChildrenAlive: '',
      motherChildrenDead: '',
      motherOccupation: '',
      motherAge: '',
      motherResidenceHouse: '',
      motherResidenceCity: '',
      motherResidenceProvince: '',
      motherResidenceCountry: '',
      fatherFirstName: '',
      fatherMiddleName: '',
      fatherLastName: '',
      fatherCitizenship: '',
      fatherReligion: '',
      fatherOccupation: '',
      fatherAge: '',
      fatherResidenceHouse: '',
      fatherResidenceCity: '',
      fatherResidenceProvince: '',
      fatherResidenceCountry: '',
      marriageDate: '',
      marriagePlace: '',
      marriageProvince: '',
      marriageCountry: '',
      attendantType: '',
      attendantName: '',
      attendantTitle: '',
      attendantAddress: '',
      attendantDate: '',
      informantName: '',
      informantRelationship: '',
      informantAddress: '',
      informantDate: '',
      preparedByName: '',
      preparedByTitle: '',
      preparedByDate: '',
      receivedByName: '',
      receivedByTitle: '',
      receivedByDate: '',
      registeredByName: '',
      registeredByTitle: '',
      registeredByDate: '',
      remarks: ''
    };
  }

  loadRequests() {
    const storedRequests = localStorage.getItem('document_requests');
    if (storedRequests) {
      try {
        const parsedRequests = JSON.parse(storedRequests);
        this.requests = parsedRequests.map((req: any) => {
          const reqId = req.id.toString();
          return {
            id: 'REQ' + reqId.padStart(3, '0'),
            user: req.userName || 'Unknown User',
            documentType: req.serviceName || req.documentType,
            department: req.departmentName || req.department,
            date: req.dateRequested ? new Date(req.dateRequested).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
            status: (req.status || 'pending').toLowerCase() as 'pending' | 'processing' | 'completed' | 'rejected' | 'ready',
            purpose: req.purpose || 'Not specified',
            details: req.notes || req.details || 'No additional details provided',
            dateRequested: req.dateRequested ? new Date(req.dateRequested).toLocaleString() : new Date().toLocaleString()
          };
        });
      } catch (e) {
        console.error('Error loading requests:', e);
        this.requests = [];
      }
    } else {
      this.requests = [];
    }
    this.filteredRequests = [...this.requests];
  }

  getStatusDisplayText(status: string): string {
    switch (status) {
      case 'processing': return 'Approved';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      case 'ready': return 'For Pick-up';
      case 'completed': return 'Completed';
      default: return status;
    }
  }

  saveRequests() {
    try {
      const requestsToSave = this.requests.map(req => ({
        id: parseInt(req.id.replace(/\D/g, '')) || Date.now(),
        userName: req.user,
        departmentName: req.department,
        serviceName: req.documentType,
        purpose: req.purpose,
        notes: req.details,
        status: req.status.charAt(0).toUpperCase() + req.status.slice(1),
        dateRequested: req.dateRequested
      }));
      localStorage.setItem('document_requests', JSON.stringify(requestsToSave));
      this.loadRequests();
    } catch (e) {
      console.error('Error saving requests:', e);
    }
  }

  openTemplateModal() {
    this.showTemplateModal = true;
    this.selectedOffice = 'Civil Registry';
  }

  closeTemplateModal() {
    this.showTemplateModal = false;
  }

  searchRequests() {
    const trimmedSearch = this.searchId?.trim() || '';

    if (!trimmedSearch && !this.selectedDocumentType && !this.selectedDepartment && !this.selectedDate && !this.selectedStatus) {
      this.filteredRequests = [...this.requests];
      return;
    }

    this.filteredRequests = this.requests.filter(req => {
      const matchesSearch = !trimmedSearch ||
        req.id.toLowerCase().includes(trimmedSearch.toLowerCase()) ||
        req.user.toLowerCase().includes(trimmedSearch.toLowerCase());

      const matchesType = !this.selectedDocumentType ||
        req.documentType === this.selectedDocumentType;

      const matchesDept = !this.selectedDepartment ||
        req.department === this.selectedDepartment;

      let matchesDate = true;
      if (this.selectedDate) {
        const [year, month, day] = this.selectedDate.split('-');
        const formattedSearchDate = `${day}/${month}/${year}`;
        matchesDate = req.date === formattedSearchDate;
      }

      const matchesStatus = !this.selectedStatus || req.status === this.selectedStatus;

      return matchesSearch && matchesType && matchesDept && matchesDate && matchesStatus;
    });
  }

  clearSearch() {
    this.searchId = '';
    this.selectedDocumentType = '';
    this.selectedDepartment = '';
    this.selectedDate = '';
    this.selectedStatus = '';
    this.filteredRequests = [...this.requests];
  }

  selectRequest(request: DocumentRequest) {
    this.selectedRequest = this.selectedRequest === request ? null : request;
  }

  viewRequest() {
    if (!this.selectedRequest) return;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
  }

  deleteRequest() {
    if (!this.selectedRequest) return;

    if (confirm(`Are you sure you want to delete request ${this.selectedRequest.id}?`)) {
      this.requests = this.requests.filter(r => r.id !== this.selectedRequest!.id);
      this.filteredRequests = this.filteredRequests.filter(r => r.id !== this.selectedRequest!.id);
      this.selectedRequest = null;
      this.updateCounts();
      this.saveRequests();
    }
  }

  approveRequest() {
    if (!this.selectedRequest) return;

    const index = this.requests.findIndex(r => r.id === this.selectedRequest!.id);
    if (index !== -1) {
      this.requests[index].status = 'processing';
      this.selectedRequest.status = 'processing';
    }

    this.updateCounts();
    this.saveRequests();
    this.logTransaction('Approved', `Request ${this.selectedRequest.id} approved and is now being processed`);
    this.closeDetailsModal();
    alert('Request approved successfully! Status changed to Processing.');
  }

  rejectRequest() {
    if (!this.selectedRequest) return;

    const index = this.requests.findIndex(r => r.id === this.selectedRequest!.id);
    if (index !== -1) {
      this.requests[index].status = 'rejected';
      this.selectedRequest.status = 'rejected';
    }

    this.updateCounts();
    this.saveRequests();
    this.logTransaction('Rejected', `Request ${this.selectedRequest.id} rejected`);
    this.closeDetailsModal();
    alert('Request rejected.');
  }

  markForPickup() {
    if (!this.selectedRequest) return;

    const index = this.requests.findIndex(r => r.id === this.selectedRequest!.id);
    if (index !== -1) {
      this.requests[index].status = 'ready';
      this.selectedRequest.status = 'ready';
    }

    this.updateCounts();
    this.saveRequests();
    this.logTransaction('Ready for Pickup', `Request ${this.selectedRequest.id} marked as ready for pickup`);
    this.closeDetailsModal();
    alert('Request marked as ready for pickup!');
  }

  updateCounts() {
    this.pendingCount = this.requests.filter(r => r.status === 'pending').length;
    this.approvedCount = this.requests.filter(r => r.status === 'processing').length;
    this.readyCount = this.requests.filter(r => r.status === 'ready').length;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'primary';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      case 'ready': return 'success';
      default: return 'medium';
    }
  }

  getDisplayedTemplates() {
    return this.certificateTemplates[this.selectedOffice] || [];
  }

  createNewCertificate(templateName: string) {
    console.log('Create new:', templateName);

    if (templateName === 'Birth Certificate') {
      this.currentTemplateName = templateName;
      this.birthCertData = this.getEmptyBirthCertData();
      this.loadSavedBirthCertTemplate();
      this.closeTemplateModal();
      this.showBirthCertificateModal = true;
    } else if (templateName === 'Marriage Certificate') {
      this.currentTemplateName = templateName;
      this.marriageCertData = this.getEmptyMarriageCertData();
      this.loadSavedMarriageCertTemplate();
      this.closeTemplateModal();
      this.showMarriageCertificateModal = true;
    } else if (templateName === 'Death Certificate') {
      this.currentTemplateName = templateName;
      this.deathCertData = this.getEmptyDeathCertData();
      this.loadSavedDeathCertTemplate();
      this.closeTemplateModal();
      this.showDeathCertificateModal = true;
    } else if (templateName === 'Business Permit' ||
      templateName === 'Tax Clearance Certificate' ||
      templateName === 'Health Certificate') {
      this.currentTemplateName = templateName;
      this.loadTemplateDefaults(templateName);
      this.closeTemplateModal();
      this.showCreateTemplateModal = true;
    } else {
      this.closeTemplateModal();
    }
  }

  loadSavedBirthCertTemplate() {
    const saved = localStorage.getItem('birth_certificate_template');
    if (saved) {
      try {
        this.birthCertData = JSON.parse(saved);
      } catch (e) {
        console.error('Error loading birth certificate template:', e);
      }
    }
  }

  loadSavedMarriageCertTemplate() {
    const saved = localStorage.getItem('marriage_certificate_template');
    if (saved) {
      try {
        this.marriageCertData = JSON.parse(saved);
      } catch (e) {
        console.error('Error loading marriage certificate template:', e);
      }
    }
  }

  saveBirthCertificateTemplate() {
    localStorage.setItem('birth_certificate_template', JSON.stringify(this.birthCertData));
    alert('Birth Certificate template saved successfully!');
  }

  saveMarriageCertificateTemplate() {
    localStorage.setItem('marriage_certificate_template', JSON.stringify(this.marriageCertData));
    alert('Marriage Certificate template saved successfully!');
  }

  loadSavedDeathCertTemplate() {
    const saved = localStorage.getItem('death_certificate_template');
    if (saved) {
      try {
        this.deathCertData = JSON.parse(saved);
      } catch (e) {
        console.error('Error loading death certificate template:', e);
      }
    }
  }

  saveDeathCertificateTemplate() {
    localStorage.setItem('death_certificate_template', JSON.stringify(this.deathCertData));
    alert('Death Certificate template saved successfully!');
  }

  closeBirthCertificateModal() {
    this.showBirthCertificateModal = false;
  }

  closeMarriageCertificateModal() {
    this.showMarriageCertificateModal = false;
  }

  closeDeathCertificateModal() {
    this.showDeathCertificateModal = false;
  }

  downloadBirthCertificatePDF() {
    alert('PDF download functionality will be implemented with a PDF library like jsPDF');
  }

  downloadMarriageCertificatePDF() {
    alert('PDF download functionality will be implemented with a PDF library like jsPDF');
  }

  downloadDeathCertificatePDF() {
    alert('PDF download functionality will be implemented with a PDF library like jsPDF');
  }

  printBirthCertificate() {
    window.print();
  }

  getEmptyMarriageCertData(): MarriageCertificateData {
    return {
      registryNo: '',
      province: '',
      cityMunicipality: '',
      husbandFirstName: '',
      husbandMiddleName: '',
      husbandLastName: '',
      husbandDateOfBirthDay: '',
      husbandDateOfBirthMonth: '',
      husbandDateOfBirthYear: '',
      husbandPlaceOfBirthCity: '',
      wifeFirstName: '',
      wifeMiddleName: '',
      wifeLastName: '',
      wifeDateOfBirthDay: '',
      wifeDateOfBirthMonth: '',
      wifeDateOfBirthYear: '',
      wifePlaceOfBirthCity: '',
      marriagePlaceCity: '',
      marriageDateDay: '',
      marriageDateMonth: '',
      marriageDateYear: '',
      marriageTimeOfMarriage: '',
      remarks: '',
      husbandSignature: '',
      wifeSignature: '',
      solemnizingOfficerName: ''
    };
  }

  getEmptyDeathCertData(): DeathCertificateData {
    return {
      province: '',
      registryNo: '',
      cityMunicipality: '',
      deceasedFirstName: '',
      deceasedMiddleName: '',
      deceasedLastName: '',
      sex: '',
      dateOfDeathDay: '',
      dateOfDeathMonth: '',
      dateOfDeathYear: '',
      timeOfDeath: '',
      ageYears: '',
      ageMonths: '',
      ageDays: '',
      dateOfBirthDay: '',
      dateOfBirthMonth: '',
      dateOfBirthYear: '',
      placeOfDeathName: '',
      placeOfDeathCity: '',
      placeOfDeathProvince: '',
      civilStatus: '',
      occupation: '',
      residenceHouse: '',
      residenceCity: '',
      residenceProvince: '',
      residenceCountry: '',
      fatherFirstName: '',
      fatherMiddleName: '',
      fatherLastName: '',
      motherFirstName: '',
      motherMiddleName: '',
      motherLastName: '',
      spouseFirstName: '',
      spouseMiddleName: '',
      spouseLastName: '',
      immediateCoD: '',
      antecedentCoD: '',
      underlyingCoD: '',
      otherConditions: '',
      mannerOfDeath: '',
      attendantType: '',
      attendantName: '',
      certifierSignature: '',
      certifierName: '',
      certifierTitle: '',
      remarks: ''
    };
  }

  loadTemplateDefaults(templateName: string) {
    this.templateName = templateName;

    if (this.savedTemplates[templateName]) {
      const saved = this.savedTemplates[templateName];
      this.headerText = saved.headerText;
      this.bodyText = saved.bodyText;
      this.footerText = saved.footerText;
      this.secretaryName = saved.secretaryName;
      return;
    }

    switch (templateName) {
      case 'Business Permit':
        this.headerText = `Republic of the Philippines
MUNICIPALITY OF CAINTA
Province of Rizal

OFFICE OF THE MAYOR
BUSINESS PERMIT AND LICENSING OFFICE

BUSINESS PERMIT`;
        this.bodyText = `PERMIT NO: 2025 _______

Pursuant to the provisions of the 2001 Revised Revenue Code of Cainta, Rizal, and Local Government Code of 1991, PERMIT is hereby GRANTED to:

[Business Name]
BUSINESS NAME

[Nature of Business]
Nature of Business

[Owner's Name]
Owner's Name

Address: [Business Address]

Signed and sealed this ___ day of __________, 2025, at Cainta, Rizal.

CONDITIONS FOR THE VALIDITY OF THIS PERMIT
• This permit must be displayed at all times in a conspicuous place in the business establishment.
• This permit shall be subject to all existing pertinent laws and ordinances, rules and regulations governing the business or trade activity.`;
        this.footerText = `Certified by:
[Name of Business Permits Officer]
Business Permits and Licensing Office`;
        this.secretaryName = '[Name of Mayor]';
        break;

      case 'Tax Clearance Certificate':
        this.headerText = `Republic of the Philippines
MUNICIPALITY OF CABANATUAN
PROVINCE OF NUEVA ECIJA

OFFICE OF THE TREASURER

TAX CLEARANCE`;
        this.bodyText = `CLEARANCE NO: __________

This is to certify that [Full Name], a resident of [Address], has been evaluated by this office and found to have fully settled all tax obligations due to the Municipality of Cabanatuan.

This clearance is being issued upon the request of the interested party for [purpose - e.g., employment, business requirement, loan application, etc.].

This certification is valid for six (6) months from the date of issuance.

Issued this ___ day of __________, 2025, at Cabanatuan City, Nueva Ecija.`;
        this.footerText = `Certified by:
[Name of Treasurer]
Municipal Treasurer`;
        this.secretaryName = '[Name of Assistant Treasurer]';
        break;

      case 'Health Certificate':
        this.headerText = `REPUBLIC OF THE PHILIPPINES
PROVINCE OF NUEVA ECIJA
MUNICIPALITY OF CABANATUAN

MUNICIPAL HEALTH OFFICE
Tel/Fax No. ___________

MEDICAL CERTIFICATE`;
        this.bodyText = `TO WHOM IT MAY CONCERN:

This is to certify that [Full Name], a resident of [Address], Barangay [Barangay Name], Cabanatuan City, is Physically Fit and not included in the list of COVID-19 Suspect in this Municipality.

This certification is being issued for whatever legal purpose it may serve his/her best.

Not valid without Official Receipt
O.R. # _______
Date: _________`;
        this.footerText = `[Name of Municipal Health Officer], MD
Municipal Health Officer
PRC # _______`;
        this.secretaryName = '[Name of Health Office Staff]';
        break;
    }
  }

  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;
    }
  }

  saveTemplate() {
    this.savedTemplates[this.currentTemplateName] = {
      templateName: this.templateName,
      headerText: this.headerText,
      bodyText: this.bodyText,
      footerText: this.footerText,
      secretaryName: this.secretaryName,
      logoFile: this.logoFile
    };

    alert(`Template for ${this.currentTemplateName} saved successfully!`);
    this.closeCreateTemplateModal();
  }

  closeCreateTemplateModal() {
    this.showCreateTemplateModal = false;
    this.resetTemplateForm();
  }

  resetTemplateForm() {
    this.currentTemplateName = '';
    this.templateName = '';
    this.logoFile = null;
    this.headerText = '';
    this.bodyText = '';
    this.footerText = '';
    this.secretaryName = '';
  }

  hasSavedBirthCertTemplate(): boolean {
    const saved = localStorage.getItem('birth_certificate_template');
    return !!saved;
  }

  hasSavedMarriageCertTemplate(): boolean {
    const saved = localStorage.getItem('marriage_certificate_template');
    return !!saved;
  }

  hasSavedDeathCertTemplate(): boolean {
    const saved = localStorage.getItem('death_certificate_template');
    return !!saved;
  }

  viewTemplate(templateName: string) {
    console.log('View template:', templateName);

    if (templateName === 'Birth Certificate') {
      if (!this.hasSavedBirthCertTemplate()) {
        alert('No saved Birth Certificate template found. Please create one first.');
        return;
      }
      this.loadSavedBirthCertTemplate();
      this.closeTemplateModal();
      this.showBirthCertificateModal = true;
    } else if (templateName === 'Marriage Certificate') {
      if (!this.hasSavedMarriageCertTemplate()) {
        alert('No saved Marriage Certificate template found. Please create one first.');
        return;
      }
      this.loadSavedMarriageCertTemplate();
      this.closeTemplateModal();
      this.showMarriageCertificateModal = true;
    } else if (templateName === 'Death Certificate') {
      if (!this.hasSavedDeathCertTemplate()) {
        alert('No saved Death Certificate template found. Please create one first.');
        return;
      }
      this.loadSavedDeathCertTemplate();
      this.closeTemplateModal();
      this.showDeathCertificateModal = true;
    } else if (templateName === 'Business Permit' ||
      templateName === 'Tax Clearance Certificate' ||
      templateName === 'Health Certificate') {

      if (this.savedTemplates[templateName]) {
        this.currentTemplateName = templateName;
        const saved = this.savedTemplates[templateName];
        this.templateName = saved.templateName;
        this.headerText = saved.headerText;
        this.bodyText = saved.bodyText;
        this.footerText = saved.footerText;
        this.secretaryName = saved.secretaryName;
        this.closeTemplateModal();
        this.showViewTemplateModal = true;
      } else {
        alert(`No saved template found for ${templateName}. Please create one first.`);
      }
    }
  }

  closeViewTemplateModal() {
    this.showViewTemplateModal = false;
    this.resetTemplateForm();
  }

  logTransaction(action: 'Approved' | 'Rejected' | 'Ready for Pickup', details: string) {
    if (!this.selectedRequest) return;

    const newLog = {
      id: 'LOG-' + Date.now(),
      requestId: this.selectedRequest.id,
      user: this.selectedRequest.user,
      documentType: this.selectedRequest.documentType,
      action: action,
      timestamp: new Date().toISOString(),
      details: details
    };

    const existingLogs = JSON.parse(localStorage.getItem('transaction_logs') || '[]');
    existingLogs.unshift(newLog);
    localStorage.setItem('transaction_logs', JSON.stringify(existingLogs));
  }

  downloadPreview() {
    alert('Download preview functionality will be implemented here');
  }
}