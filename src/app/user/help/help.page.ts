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
    groupedFaqs: { category: string, faqs: FAQ[] }[] = [];
    searchTerm: string = '';

    constructor(private helpService: HelpService) { }

    ngOnInit() {
        this.helpService.getFaqs().subscribe(faqs => {
            this.faqs = faqs;
            this.filterFaqs();
        });
    }

    filterFaqs() {
        const term = this.searchTerm.toLowerCase();
        const filtered = this.faqs.filter(faq =>
            faq.question.toLowerCase().includes(term) ||
            faq.answer.toLowerCase().includes(term) ||
            faq.category.toLowerCase().includes(term)
        );

        // Group by category
        const groups: { [key: string]: FAQ[] } = {};
        filtered.forEach(faq => {
            if (!groups[faq.category]) {
                groups[faq.category] = [];
            }
            groups[faq.category].push(faq);
        });

        this.groupedFaqs = Object.keys(groups).map(category => ({
            category,
            faqs: groups[category]
        }));
    }

}
