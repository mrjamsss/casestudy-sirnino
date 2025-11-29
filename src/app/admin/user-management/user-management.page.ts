import { Component, OnInit } from '@angular/core';
import { AuthService, UserData } from '../../services/auth.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.page.html',
    styleUrls: ['./user-management.page.scss'],
    standalone: false
})
export class UserManagementPage implements OnInit {
    users: UserData[] = [];
    filteredUsers: UserData[] = [];
    
    // Filters
    searchQuery: string = '';
    filterStatus: string = 'all';
    filterBarangay: string = 'all';
    filterRole: string = 'all';
    filterAgeGroup: string = 'all';
    
    // Tab
    selectedTab: 'all' | 'pending' = 'all';

    // Modal
    selectedUser: UserData | null = null;
    isModalOpen: boolean = false;

    // Stats
    stats = {
        total: 0,
        pending: 0,
        active: 0,
        rejected: 0
    };

    // Static Data (Barangays - usually from a service or constant)
    barangays: string[] = [
        'Pagas', 'Poblacion', 'San Jose', 'Santa Cruz', 'Santo Nino' // Add more as needed
    ];

    constructor(
        private authService: AuthService,
        private alertCtrl: AlertController,
        private toastCtrl: ToastController
    ) { }

    ngOnInit() {
        this.loadUsers();
    }

    ionViewWillEnter() {
        this.loadUsers();
    }

    loadUsers() {
        this.users = this.authService.getAllUsers();
        this.calculateStats();
        this.applyFilters();
    }

    calculateStats() {
        this.stats.total = this.users.length;
        this.stats.pending = this.users.filter(u => u.status === 'Pending').length;
        this.stats.active = this.users.filter(u => u.status === 'Active').length;
        this.stats.rejected = this.users.filter(u => u.status === 'Rejected').length;
    }

    applyFilters() {
        let tempUsers = [...this.users];

        // Tab Filter
        if (this.selectedTab === 'pending') {
            tempUsers = tempUsers.filter(u => u.status === 'Pending');
        }

        // Search
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            tempUsers = tempUsers.filter(u => 
                (u.name.givenName + ' ' + u.name.lastName).toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query) ||
                u.mobileNumber.includes(query) ||
                u.idNumber.toLowerCase().includes(query)
            );
        }

        // Status Filter (if not in pending tab)
        if (this.selectedTab === 'all' && this.filterStatus !== 'all') {
            tempUsers = tempUsers.filter(u => u.status === 'Pending' ? false : u.status === this.filterStatus); // If pending tab is separate, maybe exclude pending from 'all' tab or handle logic differently. 
            // User requested "Status Filter: Dropdown to show only 'Pending', 'Active', or 'Rejected'".
            // If I have a separate tab for Pending, maybe the Status Filter is for the "All" tab.
            // Let's assume Status Filter overrides if specific.
            tempUsers = tempUsers.filter(u => u.status === this.filterStatus);
        }

        // Barangay Filter
        if (this.filterBarangay !== 'all') {
            tempUsers = tempUsers.filter(u => u.address.barangay === this.filterBarangay);
        }

        // Role Filter
        if (this.filterRole !== 'all') {
            tempUsers = tempUsers.filter(u => u.role === this.filterRole);
        }

        // Age Group Filter
        if (this.filterAgeGroup !== 'all') {
            tempUsers = tempUsers.filter(u => {
                const age = this.calculateAge(u.dateOfBirth);
                if (this.filterAgeGroup === 'senior') return age >= 60;
                if (this.filterAgeGroup === 'youth') return age < 18;
                if (this.filterAgeGroup === 'adult') return age >= 18 && age < 60;
                return true;
            });
        }

        this.filteredUsers = tempUsers;
    }

    onSearchChange(event: any) {
        this.searchQuery = event.detail.value;
        this.applyFilters();
    }

    onFilterChange() {
        this.applyFilters();
    }

    onTabChange(event: any) {
        this.selectedTab = event.detail.value;
        // Reset status filter if switching to pending tab to avoid confusion?
        if (this.selectedTab === 'pending') {
            this.filterStatus = 'all'; 
        }
        this.applyFilters();
    }

    calculateAge(dateOfBirth: string): number {
        if (!dateOfBirth) return 0;
        const dob = new Date(dateOfBirth);
        const diffMs = Date.now() - dob.getTime();
        const ageDt = new Date(diffMs);
        return Math.abs(ageDt.getUTCFullYear() - 1970);
    }

    getFullName(user: UserData): string {
        return `${user.name.givenName} ${user.name.middleInitial ? user.name.middleInitial + '.' : ''} ${user.name.lastName} ${user.name.extension || ''}`;
    }

    // Actions
    openUserDetail(user: UserData) {
        this.selectedUser = user;
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedUser = null;
    }

    async approveUser(user: UserData) {
        const alert = await this.alertCtrl.create({
            header: 'Confirm Approval',
            message: `Are you sure you want to approve ${this.getFullName(user)}?`,
            buttons: [
                { text: 'Cancel', role: 'cancel' },
                {
                    text: 'Approve',
                    handler: () => {
                        user.status = 'Active';
                        this.authService.updateUser(user);
                        this.showToast('User approved successfully');
                        this.loadUsers();
                    }
                }
            ]
        });
        await alert.present();
    }

    async rejectUser(user: UserData) {
        const alert = await this.alertCtrl.create({
            header: 'Reject User',
            inputs: [
                {
                    name: 'reason',
                    type: 'text',
                    placeholder: 'Reason for rejection'
                }
            ],
            buttons: [
                { text: 'Cancel', role: 'cancel' },
                {
                    text: 'Reject',
                    handler: (data) => {
                        user.status = 'Rejected';
                        // In a real app, we'd save the reason too.
                        this.authService.updateUser(user);
                        this.showToast('User rejected');
                        this.loadUsers();
                    }
                }
            ]
        });
        await alert.present();
    }

    async deleteUser(user: UserData) {
        const alert = await this.alertCtrl.create({
            header: 'Confirm Delete',
            message: `Are you sure you want to delete ${this.getFullName(user)}? This action cannot be undone.`,
            buttons: [
                { text: 'Cancel', role: 'cancel' },
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        this.authService.deleteUser(user.email);
                        this.showToast('User deleted successfully');
                        this.loadUsers();
                    }
                }
            ]
        });
        await alert.present();
    }

    async resetPassword(user: UserData) {
        const result = await this.authService.resetPassword(user.email);
        this.showToast(result.message);
    }

    async showToast(message: string) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 2000,
            position: 'bottom'
        });
        await toast.present();
    }

    exportData() {
        // Simple CSV Export
        const headers = ['Full Name', 'Email', 'Mobile', 'Role', 'Status', 'Barangay', 'Date Registered'];
        const rows = this.filteredUsers.map(u => [
            this.getFullName(u),
            u.email,
            u.mobileNumber,
            u.role,
            u.status,
            u.address.barangay,
            new Date(u.dateRegistered).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }
}
