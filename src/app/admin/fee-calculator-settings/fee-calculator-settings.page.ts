import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

interface GradeResult {
    score: number;
    grade: string;
    gradePoint: number;
    message: string;
    icon: string;
}

@Component({
    selector: 'app-fee-calculator-settings',
    templateUrl: './fee-calculator-settings.page.html',
    styleUrls: ['./fee-calculator-settings.page.scss'],
    standalone: false,
})
export class FeeCalculatorSettingsPage {
    studentScore: number | null = null;
    gradeResult: GradeResult | null = null;

    constructor(private toastController: ToastController) { }


    calculateGrade() {
        if (this.studentScore === null || this.studentScore === undefined) {
            this.showToast('Please enter a student score', 'warning');
            return;
        }

        // Validate score range
        if (this.studentScore < 0 || this.studentScore > 100) {
            this.showToast('Score must be between 0 and 100', 'danger');
            return;
        }

        let grade: string;
        let gradePoint: number;
        let message: string;
        let icon: string;

        // Using IF-ELSE statements to determine grade (as per PROJECT35 requirements)
        if (this.studentScore >= 90 && this.studentScore <= 100) {
            grade = 'Grade A';
            gradePoint = 4.0;
            message = '🎉 Excellent! Outstanding performance!';
            icon = 'trophy-outline';
        } else if (this.studentScore >= 80 && this.studentScore < 90) {
            grade = 'Grade B';
            gradePoint = 3.0;
            message = '👍 Good job! Keep up the great work!';
            icon = 'thumbs-up-outline';
        } else if (this.studentScore >= 70 && this.studentScore < 80) {
            grade = 'Grade C';
            gradePoint = 2.0;
            message = '📖 Average. There\'s room for improvement!';
            icon = 'book-outline';
        } else if (this.studentScore >= 60 && this.studentScore < 70) {
            grade = 'Grade D';
            gradePoint = 1.0;
            message = '⚠️ Passing, but needs more effort!';
            icon = 'warning-outline';
        } else {
            grade = 'Grade E';
            gradePoint = 0.0;
            message = '❌ Failing. Please study harder!';
            icon = 'close-circle-outline';
        }

        // Create grade result
        this.gradeResult = {
            score: this.studentScore,
            grade: grade,
            gradePoint: gradePoint,
            message: message,
            icon: icon
        };

        // Show success toast
        this.showToast(`Grade calculated: ${grade}`, 'success');


        // Scroll to result
        setTimeout(() => {
            const resultElement = document.querySelector('.result-card');
            if (resultElement) {
                resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }

    async showToast(message: string, color: string) {
        const toast = await this.toastController.create({
            message,
            duration: 1500,
            position: 'bottom',
            color,
            cssClass: 'custom-toast'
        });
        await toast.present();
    }
}
