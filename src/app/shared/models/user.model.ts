export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'resident';
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
}
