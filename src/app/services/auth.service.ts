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

    // Add new user
    users.push(userData);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));

    this.loadingSubject.next(false);
    
    console.log('Registration successful:', userData.email);
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
}
