import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UserStatus = 'pending' | 'active' | 'rejected' | 'suspended';

export interface UserData {
  name: {
    givenName: string;
    middleInitial: string;
    lastName: string;
    extension: string;
  };
  address: {
    houseNo: string;
    street: string;
    purok: string;
    barangay: string;
    municipality: string;
    province: string;
    postalCode: string;
  };
  idType: string;
  idNumber: string;
  dateOfBirth: string;
  mobileNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'admin';
  status: UserStatus;
  dateRegistered: string;
  rejectionReason?: string;
  lastLogin?: string;
}

export interface LoginData {
  email: string;
  password: string;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private readonly STORAGE_KEY = 'cbn_registered_users';

  idTypes = [
    "Philippine National ID (PhilSys ID)",
    "Driver's License",
    "Voter's ID or COMELEC Voter ID",
    "Passport",
    "SSS ID",
    "GSIS ID",
    "Unified Multi-Purpose ID (UMID)",
    "TIN ID",
    "PhilHealth ID",
    "Postal ID",
    "PRC ID"
  ];

  constructor() {}

  async login(credentials: LoginData): Promise<{ success: boolean; message?: string }> {
    this.loadingSubject.next(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check admin credentials
    if (credentials.role === 'admin') {
      if (credentials.email === 'admin@city.gov' && credentials.password === '123456') {
        this.loadingSubject.next(false);
        console.log('Admin login successful');
        return { success: true };
      } else {
        this.loadingSubject.next(false);
        return { 
          success: false, 
          message: 'Invalid admin credentials. Try: admin@city.gov / 123456' 
        };
      }
    }

    // Check regular user credentials
    const users = this.getRegisteredUsers();
    const user = users.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password &&
      u.role === credentials.role
    );

    this.loadingSubject.next(false);

    if (user) {
      console.log('User login successful:', user.email);
      return { success: true };
    } else {
      return { 
        success: false, 
        message: 'Invalid email or password.' 
      };
    }
  }

  async register(userData: UserData): Promise<{ success: boolean; message?: string }> {
    this.loadingSubject.next(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get existing users
    const users = this.getRegisteredUsers();

    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      this.loadingSubject.next(false);
      return { 
        success: false, 
        message: 'This email is already registered.' 
      };
    }

    // Set initial status and registration date
    const newUser: UserData = {
      ...userData,
      status: 'pending',
      dateRegistered: new Date().toISOString()
    };

    // Add new user
    users.push(newUser);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));

    this.loadingSubject.next(false);
    
    console.log('Registration successful:', newUser.email);
    console.log('All registered users:', users);
    
    return { success: true };
  }

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if email exists in registered users
    const users = this.getRegisteredUsers();
    const userExists = users.some(user => user.email === email) || email === 'admin@city.gov';
    
    if (!userExists) {
      return {
        success: false,
        message: 'No account found with this email address.'
      };
    }
    
    // For demo/testing - just return success
    console.log('Password reset link sent to:', email);
    
    return {
      success: true,
      message: 'Password reset link has been sent to your email.'
    };
    
    // TODO: Later connect to real backend API
    // return this.http.post('/api/auth/reset-password', { email }).toPromise();
  }

  private getRegisteredUsers(): UserData[] {
    const users = localStorage.getItem(this.STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }

  // Get all registered users (for debugging)
  getAllUsers(): UserData[] {
    return this.getRegisteredUsers();
  }

  // Clear all users (for testing)
  clearAllUsers(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('All users cleared from storage');
  }

  // ===== USER MANAGEMENT METHODS =====

  // Update user status (approve, reject, suspend)
  updateUserStatus(email: string, status: UserStatus, rejectionReason?: string): boolean {
    const users = this.getRegisteredUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      return false;
    }

    users[userIndex].status = status;
    if (status === 'rejected' && rejectionReason) {
      users[userIndex].rejectionReason = rejectionReason;
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    console.log(`User ${email} status updated to ${status}`);
    return true;
  }

  // Update user information
  updateUser(email: string, updatedData: Partial<UserData>): boolean {
    const users = this.getRegisteredUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      return false;
    }

    // Merge updated data with existing user data
    users[userIndex] = { ...users[userIndex], ...updatedData };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    console.log(`User ${email} updated successfully`);
    return true;
  }

  // Delete user
  deleteUser(email: string): boolean {
    const users = this.getRegisteredUsers();
    const filteredUsers = users.filter(u => u.email !== email);
    
    if (filteredUsers.length === users.length) {
      return false; // User not found
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredUsers));
    console.log(`User ${email} deleted successfully`);
    return true;
  }

  // Bulk delete users
  bulkDeleteUsers(emails: string[]): number {
    const users = this.getRegisteredUsers();
    const filteredUsers = users.filter(u => !emails.includes(u.email));
    const deletedCount = users.length - filteredUsers.length;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredUsers));
    console.log(`${deletedCount} users deleted successfully`);
    return deletedCount;
  }

  // Get users by status
  getUsersByStatus(status: UserStatus): UserData[] {
    return this.getRegisteredUsers().filter(u => u.status === status);
  }

  // Get users by barangay
  getUsersByBarangay(barangay: string): UserData[] {
    return this.getRegisteredUsers().filter(u => 
      u.address.barangay.toLowerCase() === barangay.toLowerCase()
    );
  }

  // Get users by role
  getUsersByRole(role: 'user' | 'admin'): UserData[] {
    return this.getRegisteredUsers().filter(u => u.role === role);
  }

  // Calculate age from date of birth
  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Get statistics
  getStatistics() {
    const users = this.getRegisteredUsers();
    const totalCitizens = users.filter(u => u.role === 'user').length;
    const pendingVerifications = users.filter(u => u.status === 'pending').length;
    
    // Users by barangay
    const barangayMap = new Map<string, number>();
    users.forEach(u => {
      if (u.role === 'user') {
        const barangay = u.address.barangay;
        barangayMap.set(barangay, (barangayMap.get(barangay) || 0) + 1);
      }
    });
    
    const usersByBarangay = Array.from(barangayMap.entries())
      .map(([barangay, count]) => ({ barangay, count }))
      .sort((a, b) => b.count - a.count);

    // Age distribution
    const ageGroups = {
      youth: 0,      // < 18
      adult: 0,      // 18-59
      senior: 0      // 60+
    };

    users.forEach(u => {
      if (u.role === 'user') {
        const age = this.calculateAge(u.dateOfBirth);
        if (age < 18) {
          ageGroups.youth++;
        } else if (age < 60) {
          ageGroups.adult++;
        } else {
          ageGroups.senior++;
        }
      }
    });

    return {
      totalCitizens,
      pendingVerifications,
      usersByBarangay,
      ageGroups,
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      rejectedUsers: users.filter(u => u.status === 'rejected').length,
      suspendedUsers: users.filter(u => u.status === 'suspended').length
    };
  }

  // Get full name from user data
  getFullName(user: UserData): string {
    const { givenName, middleInitial, lastName, extension } = user.name;
    const middle = middleInitial ? `${middleInitial}. ` : '';
    const ext = extension ? ` ${extension}` : '';
    return `${givenName} ${middle}${lastName}${ext}`.trim();
  }

  // Export users to CSV
  exportToCSV(users: UserData[]): string {
    const headers = [
      'Full Name',
      'Email',
      'Mobile Number',
      'Status',
      'Role',
      'Barangay',
      'Age',
      'ID Type',
      'ID Number',
      'Date Registered'
    ];

    const rows = users.map(user => [
      this.getFullName(user),
      user.email,
      user.mobileNumber,
      user.status,
      user.role,
      user.address.barangay,
      this.calculateAge(user.dateOfBirth).toString(),
      user.idType,
      user.idNumber,
      new Date(user.dateRegistered).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  // Download CSV file
  downloadCSV(users: UserData[], filename: string = 'users-export.csv'): void {
    const csvContent = this.exportToCSV(users);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
