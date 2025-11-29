import { Component, OnInit } from '@angular/core';
import { AuthService, UserData, UserStatus } from '../../services/auth.service';
import { AlertController, ModalController } from '@ionic/angular';

interface UserStatistics {
  totalCitizens: number;
  pendingVerifications: number;
  usersByBarangay: { barangay: string; count: number }[];
  ageGroups: { youth: number; adult: number; senior: number };
  totalUsers: number;
  activeUsers: number;
  rejectedUsers: number;
  suspendedUsers: number;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
  standalone: false
})
export class UserManagementPage implements OnInit {
  // Data
  allUsers: UserData[] = [];
  filteredUsers: UserData[] = [];
  displayedUsers: UserData[] = [];
  statistics: UserStatistics | null = null;

  // Active tab
  activeTab: 'all' | 'pending' = 'all';

  // Search & Filters
  searchTerm: string = '';
  statusFilter: UserStatus | 'all' = 'all';
  barangayFilter: string = 'all';
  roleFilter: 'user' | 'admin' | 'all' = 'all';
  ageGroupFilter: 'all' | 'youth' | 'adult' | 'senior' = 'all';

  // Available filter options
  availableBarangays: string[] = [];
  statusOptions: (UserStatus | 'all')[] = ['all', 'pending', 'active', 'rejected', 'suspended'];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  pageSizeOptions: number[] = [10, 25, 50, 100];

  // Sorting
  sortColumn: string = 'dateRegistered';
  sortDirection: 'asc' | 'desc' = 'desc';

  // Selection
  selectedUsers: Set<string> = new Set();
  selectAll: boolean = false;

  // Modals
  selectedUser: UserData | null = null;
  showUserDetailModal: boolean = false;
  showEditModal: boolean = false;
  showApprovalModal: boolean = false;
  editFormData: Partial<UserData> = {};
  rejectionReason: string = '';

  // Make Math available in template
  Math = Math;

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  // ===== DATA LOADING =====

  loadUsers() {
    this.allUsers = this.authService.getAllUsers();
    this.statistics = this.authService.getStatistics();
    this.extractBarangays();
    this.applyFilters();
  }

  extractBarangays() {
    const barangaySet = new Set<string>();
    this.allUsers.forEach(user => {
      if (user.address.barangay) {
        barangaySet.add(user.address.barangay);
      }
    });
    this.availableBarangays = Array.from(barangaySet).sort();
  }

  // ===== SEARCH & FILTER =====

  applyFilters() {
    let users = [...this.allUsers];

    // Tab filter
    if (this.activeTab === 'pending') {
      users = users.filter(u => u.status === 'pending');
    }

    // Search
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      users = users.filter(u => 
        this.authService.getFullName(u).toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.mobileNumber.includes(term) ||
        u.idNumber.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      users = users.filter(u => u.status === this.statusFilter);
    }

    // Barangay filter
    if (this.barangayFilter !== 'all') {
      users = users.filter(u => u.address.barangay === this.barangayFilter);
    }

    // Role filter
    if (this.roleFilter !== 'all') {
      users = users.filter(u => u.role === this.roleFilter);
    }

    // Age group filter
    if (this.ageGroupFilter !== 'all') {
      users = users.filter(u => {
        const age = this.authService.calculateAge(u.dateOfBirth);
        if (this.ageGroupFilter === 'youth') return age < 18;
        if (this.ageGroupFilter === 'adult') return age >= 18 && age < 60;
        if (this.ageGroupFilter === 'senior') return age >= 60;
        return true;
      });
    }

    this.filteredUsers = users;
    this.applySorting();
    this.updatePagination();
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.barangayFilter = 'all';
    this.roleFilter = 'all';
    this.ageGroupFilter = 'all';
    this.applyFilters();
  }

  // ===== SORTING =====

  applySorting() {
    this.filteredUsers.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortColumn) {
        case 'name':
          aValue = this.authService.getFullName(a);
          bValue = this.authService.getFullName(b);
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'barangay':
          aValue = a.address.barangay;
          bValue = b.address.barangay;
          break;
        case 'age':
          aValue = this.authService.calculateAge(a.dateOfBirth);
          bValue = this.authService.calculateAge(b.dateOfBirth);
          break;
        case 'dateRegistered':
          aValue = new Date(a.dateRegistered).getTime();
          bValue = new Date(b.dateRegistered).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySorting();
    this.updatePagination();
  }

  // ===== PAGINATION =====

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
    this.updateDisplayedUsers();
  }

  updateDisplayedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedUsers();
    }
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.updatePagination();
  }

  // ===== SELECTION =====

  toggleSelectAll() {
    if (this.selectAll) {
      this.displayedUsers.forEach(u => this.selectedUsers.add(u.email));
    } else {
      this.selectedUsers.clear();
    }
  }

  toggleUserSelection(email: string) {
    if (this.selectedUsers.has(email)) {
      this.selectedUsers.delete(email);
    } else {
      this.selectedUsers.add(email);
    }
    this.updateSelectAllState();
  }

  updateSelectAllState() {
    this.selectAll = this.displayedUsers.length > 0 && 
      this.displayedUsers.every(u => this.selectedUsers.has(u.email));
  }

  // ===== USER ACTIONS =====

  viewUserDetails(user: UserData) {
    this.selectedUser = user;
    this.showUserDetailModal = true;
  }

  closeUserDetailModal() {
    this.showUserDetailModal = false;
    this.selectedUser = null;
  }

  openApprovalModal(user: UserData) {
    this.selectedUser = user;
    this.rejectionReason = '';
    this.showApprovalModal = true;
  }

  closeApprovalModal() {
    this.showApprovalModal = false;
    this.selectedUser = null;
    this.rejectionReason = '';
  }

  async approveUser(user: UserData) {
    const alert = await this.alertController.create({
      header: 'Approve User',
      message: `Are you sure you want to approve ${this.authService.getFullName(user)}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Approve',
          handler: () => {
            const success = this.authService.updateUserStatus(user.email, 'active');
            if (success) {
              this.showSuccessAlert('User approved successfully');
              this.loadUsers();
              this.closeApprovalModal();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async rejectUser(user: UserData) {
    if (!this.rejectionReason.trim()) {
      this.showErrorAlert('Please provide a reason for rejection');
      return;
    }

    const success = this.authService.updateUserStatus(user.email, 'rejected', this.rejectionReason);
    if (success) {
      this.showSuccessAlert('User rejected');
      this.loadUsers();
      this.closeApprovalModal();
    }
  }

  openEditModal(user: UserData) {
    this.selectedUser = user;
    this.editFormData = { ...user };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUser = null;
    this.editFormData = {};
  }

  saveUserEdit() {
    if (!this.selectedUser) return;

    const success = this.authService.updateUser(this.selectedUser.email, this.editFormData);
    if (success) {
      this.showSuccessAlert('User updated successfully');
      this.loadUsers();
      this.closeEditModal();
    }
  }

  async suspendUser(user: UserData) {
    const alert = await this.alertController.create({
      header: 'Suspend User',
      message: `Are you sure you want to suspend ${this.authService.getFullName(user)}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Suspend',
          handler: () => {
            const success = this.authService.updateUserStatus(user.email, 'suspended');
            if (success) {
              this.showSuccessAlert('User suspended');
              this.loadUsers();
              this.closeUserDetailModal();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async activateUser(user: UserData) {
    const alert = await this.alertController.create({
      header: 'Activate User',
      message: `Are you sure you want to activate ${this.authService.getFullName(user)}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Activate',
          handler: () => {
            const success = this.authService.updateUserStatus(user.email, 'active');
            if (success) {
              this.showSuccessAlert('User activated');
              this.loadUsers();
              this.closeUserDetailModal();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteUser(user: UserData) {
    const alert = await this.alertController.create({
      header: 'Delete User',
      message: `Are you sure you want to delete ${this.authService.getFullName(user)}? This action cannot be undone.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            const success = this.authService.deleteUser(user.email);
            if (success) {
              this.showSuccessAlert('User deleted');
              this.loadUsers();
              this.closeUserDetailModal();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async resetPassword(user: UserData) {
    const result = await this.authService.resetPassword(user.email);
    if (result.success) {
      this.showSuccessAlert(result.message);
    } else {
      this.showErrorAlert(result.message);
    }
  }

  // ===== BULK ACTIONS =====

  async bulkApprove() {
    const selectedEmails = Array.from(this.selectedUsers);
    const alert = await this.alertController.create({
      header: 'Bulk Approve',
      message: `Approve ${selectedEmails.length} selected user(s)?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Approve',
          handler: () => {
            selectedEmails.forEach(email => {
              this.authService.updateUserStatus(email, 'active');
            });
            this.showSuccessAlert(`${selectedEmails.length} users approved`);
            this.selectedUsers.clear();
            this.selectAll = false;
            this.loadUsers();
          }
        }
      ]
    });
    await alert.present();
  }

  async bulkDelete() {
    const selectedEmails = Array.from(this.selectedUsers);
    const alert = await this.alertController.create({
      header: 'Bulk Delete',
      message: `Delete ${selectedEmails.length} selected user(s)? This action cannot be undone.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            const deletedCount = this.authService.bulkDeleteUsers(selectedEmails);
            this.showSuccessAlert(`${deletedCount} users deleted`);
            this.selectedUsers.clear();
            this.selectAll = false;
            this.loadUsers();
          }
        }
      ]
    });
    await alert.present();
  }

  // ===== EXPORT =====

  exportToCSV() {
    const filename = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    this.authService.downloadCSV(this.filteredUsers, filename);
    this.showSuccessAlert('CSV exported successfully');
  }

  // ===== HELPERS =====

  switchTab(tab: 'all' | 'pending') {
    this.activeTab = tab;
    this.currentPage = 1;
    this.applyFilters();
  }

  getFullName(user: UserData): string {
    return this.authService.getFullName(user);
  }

  getAge(user: UserData): number {
    return this.authService.calculateAge(user.dateOfBirth);
  }

  getStatusClass(status: UserStatus): string {
    const classes: Record<UserStatus, string> = {
      pending: 'status-pending',
      active: 'status-active',
      rejected: 'status-rejected',
      suspended: 'status-suspended'
    };
    return classes[status] || '';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getFullAddress(user: UserData): string {
    const addr = user.address;
    return `${addr.houseNo} ${addr.street} ${addr.purok}, Brgy. ${addr.barangay}, ${addr.municipality}, ${addr.province}, ${addr.postalCode}`.trim();
  }

  async showSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}

