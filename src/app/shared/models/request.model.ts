export interface Request {
    id: string;
    userId?: string;
    userFullName: string;
    documentType: string;
    department: string;
    date: string;
    status: 'pending' | 'processing' | 'completed' | 'rejected' | 'ready';
    purpose?: string;
    details?: string;
    dateRequested?: string;
}
