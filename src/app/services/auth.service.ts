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
  private readonly ADMIN_PASSWORD_KEY = 'cbn_admin_password';

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
      const storedAdminPassword = localStorage.getItem(this.ADMIN_PASSWORD_KEY) || '123456';

      if (credentials.email === 'admin@city.gov' && credentials.password === storedAdminPassword) {
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
          password: storedAdminPassword,
          confirmPassword: storedAdminPassword,
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
          message: 'Invalid admin credentials.'
        };
      }
    }

    // Check regular user credentials
    const users = this.getRegisteredUsers();

    // First, find user by email and role only
    const userByEmail = users.find(u =>
      u.email === credentials.email &&
      u.role === credentials.role
    );

    this.loadingSubject.next(false);

    // If user exists with this email and role
    if (userByEmail) {
      // Check account status BEFORE validating password
      if (userByEmail.status === 'Pending') {
        return {
          success: false,
          message: 'Your account is pending approval. Please wait for admin verification.'
        };
      }

      if (userByEmail.status === 'Rejected') {
        return {
          success: false,
          message: 'Your account has been rejected. Please contact the administrator.'
        };
      }

      if (userByEmail.status === 'Suspended') {
        return {
          success: false,
          message: 'Your account has been suspended. Please contact the administrator.'
        };
      }

      // Now check password for Active users
      if (userByEmail.status === 'Active') {
        if (userByEmail.password === credentials.password) {
          console.log('User login successful:', userByEmail.email);
          this.setCurrentUser(userByEmail);
          return { success: true };
        } else {
          return {
            success: false,
            message: 'Invalid password.'
          };
        }
      }

      // Fallback for any other status
      return {
        success: false,
        message: `Your account status is ${userByEmail.status}. Please contact the administrator.`
      };
    } else {
      // User not found with this email and role
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

    return {
      success: true,
      message: 'Registration successful! Your account is pending admin approval. You will be notified once approved.'
    };
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

  // Admin Password Management
  getAdminPassword(): string {
    return localStorage.getItem(this.ADMIN_PASSWORD_KEY) || '123456';
  }

  updateAdminPassword(password: string): void {
    localStorage.setItem(this.ADMIN_PASSWORD_KEY, password);

    // Also update current user if logged in as admin
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.role === 'admin') {
      currentUser.password = password;
      currentUser.confirmPassword = password;
      this.setCurrentUser(currentUser);
    }
  }
}
