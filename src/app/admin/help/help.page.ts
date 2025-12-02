import { Component, OnInit } from '@angular/core';
import { HelpService, FAQ } from '../../services/help.service';

@Component({
    selector: 'app-help',
    templateUrl: './help.page.html',
    styleUrls: ['./help.page.scss'],
    standalone: false
})
export class HelpPage implements OnInit {

    faqs: FAQ[] = [];

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

    constructor(private helpService: HelpService) { }

    ngOnInit() {
        this.helpService.getFaqs().subscribe(faqs => {
            this.faqs = faqs;
        });
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
            this.helpService.addFaq(newFAQ);
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
            const updatedFaq: FAQ = {
                ...this.selectedFaq,
                category: this.modalCategory,
                question: this.modalQuestion,
                answer: this.modalAnswer
            };
            this.helpService.updateFaq(updatedFaq);
            this.selectedFaq = updatedFaq; // Update selection reference
            this.closeModal();
        }
    }

    deleteSelectedFAQ() {
        if (this.selectedFaq) {
            this.helpService.deleteFaq(this.selectedFaq.id);
            this.selectedFaq = null;
        }
    }

}
