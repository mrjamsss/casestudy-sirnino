import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FAQ {
    id: number;
    category: string;
    question: string;
    answer: string;
}

@Injectable({
    providedIn: 'root'
})
export class HelpService {

    private initialFaqs: FAQ[] = [
        {
            id: 1,
            category: 'Documents',
            question: 'How do I request a birth certificate?',
            answer: 'Go to "Request Documents", select "Birth Certificate", fill out the form with required information, and submit.'
        },
        {
            id: 2,
            category: 'Account',
            question: 'How do I reset my password?',
            answer: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.'
        },
        {
            id: 3,
            category: 'Payments',
            question: 'What payment methods are accepted?',
            answer: 'We accept credit/debit cards, GCash, and over-the-counter payments at City Hall.'
        },
        {
            id: 4,
            category: 'General',
            question: 'What are the office hours?',
            answer: 'City Hall is open from Monday to Friday, 8:00 AM to 5:00 PM.'
        }
    ];

    private faqsSubject = new BehaviorSubject<FAQ[]>([]);

    constructor() {
        this.loadFaqs();
    }

    private loadFaqs() {
        const savedFaqs = localStorage.getItem('app_faqs');
        if (savedFaqs) {
            this.faqsSubject.next(JSON.parse(savedFaqs));
        } else {
            this.faqsSubject.next(this.initialFaqs);
        }
    }

    private saveFaqs(faqs: FAQ[]) {
        localStorage.setItem('app_faqs', JSON.stringify(faqs));
        this.faqsSubject.next(faqs);
    }

    getFaqs(): Observable<FAQ[]> {
        return this.faqsSubject.asObservable();
    }

    addFaq(faq: FAQ) {
        const currentFaqs = this.faqsSubject.value;
        const newFaqs = [faq, ...currentFaqs];
        this.saveFaqs(newFaqs);
    }

    updateFaq(updatedFaq: FAQ) {
        const currentFaqs = this.faqsSubject.value;
        const index = currentFaqs.findIndex(f => f.id === updatedFaq.id);
        if (index !== -1) {
            currentFaqs[index] = updatedFaq;
            this.saveFaqs([...currentFaqs]);
        }
    }

    deleteFaq(id: number) {
        const currentFaqs = this.faqsSubject.value;
        const newFaqs = currentFaqs.filter(f => f.id !== id);
        this.saveFaqs(newFaqs);
    }
}
