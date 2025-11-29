import { Component, OnInit } from '@angular/core';

export interface FAQ {
    id: number;
    category: string;
    question: string;
    answer: string;
}

@Component({
    selector: 'app-help',
    templateUrl: './help.page.html',
    styleUrls: ['./help.page.scss'],
    standalone: false
})
export class HelpPage implements OnInit {

    faqs: FAQ[] = [
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

    categories: string[] = ['Documents', 'Account', 'Payments', 'General', 'Technical Support'];

    // Form models for "Add FAQ" (Inline)
    selectedCategory: string = '';
    question: string = '';
    answer: string = '';

    // Selection & Modal state
    selectedFaq: FAQ | null = null;
    isModalOpen: boolean = false;
    modalMode: 'view' | 'edit' = 'view';

    // Modal Form models
    modalCategory: string = '';
    modalQuestion: string = '';
    modalAnswer: string = '';

    constructor() { }

    ngOnInit() {
    }

    // --- Inline Form (Add) ---

    saveFAQ() {
        if (this.selectedCategory && this.question && this.answer) {
            const newFAQ: FAQ = {
                id: this.faqs.length > 0 ? Math.max(...this.faqs.map(f => f.id)) + 1 : 1,
                category: this.selectedCategory,
                question: this.question,
                answer: this.answer
            };
            this.faqs.unshift(newFAQ); // Add to top
            this.clearForm();
        }
    }

    clearForm() {
        this.selectedCategory = '';
        this.question = '';
        this.answer = '';
    }

    // --- Table Actions & Selection ---

    selectFaq(faq: FAQ) {
        this.selectedFaq = this.selectedFaq === faq ? null : faq;
    }

    openModal(mode: 'view' | 'edit') {
        if (!this.selectedFaq) return;

        this.modalMode = mode;
        this.modalCategory = this.selectedFaq.category;
        this.modalQuestion = this.selectedFaq.question;
        this.modalAnswer = this.selectedFaq.answer;
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.modalCategory = '';
        this.modalQuestion = '';
        this.modalAnswer = '';
    }

    updateFAQ() {
        if (this.selectedFaq && this.modalCategory && this.modalQuestion && this.modalAnswer) {
            const index = this.faqs.findIndex(f => f.id === this.selectedFaq!.id);
            if (index !== -1) {
                this.faqs[index] = {
                    ...this.selectedFaq,
                    category: this.modalCategory,
                    question: this.modalQuestion,
                    answer: this.modalAnswer
                };
                // Update selection reference to reflect changes immediately if needed, 
                // though replacing the object in array is usually enough for Angular change detection 
                // if trackBy is not strictly by identity or if we update the reference.
                this.selectedFaq = this.faqs[index];
            }
            this.closeModal();
        }
    }

    deleteSelectedFAQ() {
        if (this.selectedFaq) {
            this.faqs = this.faqs.filter(f => f.id !== this.selectedFaq!.id);
            this.selectedFaq = null;
        }
    }

}
