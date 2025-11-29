import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  status: 'Pending' | 'Active' | 'Rejected' | 'Suspended';
  dateRegistered: string;
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
  private readonly CURRENT_USER_KEY = 'cbn_current_user';

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

  constructor() { }

  async login(credentials: LoginData): Promise<{ success: boolean; message?: string }> {
    this.loadingSubject.next(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check admin credentials
    if (credentials.role === 'admin') {
      if (credentials.email === 'admin@city.gov' && credentials.password === '123456') {
        this.loadingSubject.next(false);
        console.log('Admin login successful');
        // Store admin user
        const adminUser: UserData = {
          name: { givenName: 'Admin', middleInitial: '', lastName: 'User', extension: '' },
          address: { houseNo: '', street: '', purok: '', barangay: '', municipality: 'Cabanatuan City', province: 'Nueva Ecija', postalCode: '' },
          idType: '',
          idNumber: '',
          dateOfBirth: '',
          mobileNumber: '',
          email: credentials.email,
          password: '',
          confirmPassword: '',
          role: 'admin',
          status: 'Active',
          dateRegistered: new Date().toISOString()
        };
        this.setCurrentUser(adminUser);
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
      if (user.status !== 'Active' && user.status !== 'Pending') {
        if (user.status === 'Rejected' || user.status === 'Suspended') {
          return { success: false, message: `Your account is ${user.status}.` };
        }
      }
      console.log('User login successful:', user.email);
      // Store logged-in user
      this.setCurrentUser(user);
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

    // Add new user with default status and date
    const newUser: UserData = {
      ...userData,
      status: 'Pending',
      dateRegistered: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    this.loadingSubject.next(false);

    console.log('Registration successful:', newUser.email);

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
  }

  // Session Management Methods

  getCurrentUser(): UserData | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  setCurrentUser(user: UserData): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    console.log('User logged out');
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  // User Management Methods

  updateUser(updatedUser: UserData): void {
    const users = this.getRegisteredUsers();
    const index = users.findIndex(u => u.email === updatedUser.email);
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsers(users);
    }
  }

  deleteUser(email: string): void {
    let users = this.getRegisteredUsers();
    users = users.filter(u => u.email !== email);
    this.saveUsers(users);
  }

  private getRegisteredUsers(): UserData[] {
    const users = localStorage.getItem(this.STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: UserData[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  // Get all registered users (for debugging/admin)
  getAllUsers(): UserData[] {
    return this.getRegisteredUsers();
  }

  // Clear all users (for testing)
  clearAllUsers(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('All users cleared from storage');
  }
}
