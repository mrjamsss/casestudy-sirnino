export interface Service {
    id: number;
    name: string;
    type: 'Certificate' | 'Permit' | 'Payment' | string;
    requirements: string[];
    processingTime: string;
    fee: number;
}

export interface Department {
    id: number;
    name: string;
    description: string;
    services: Service[];
}
