import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-official-modal',
    templateUrl: './official-modal.component.html',
    styleUrls: ['./official-modal.component.scss'],
    standalone: false
})
export class OfficialModalComponent implements OnInit {
    @Input() official: any; // If editing, this will be passed

    officialForm!: FormGroup;
    previewImage: string | null = null;

    constructor(
        private modalController: ModalController,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.initForm();
        if (this.official) {
            this.officialForm.patchValue({
                name: this.official.name,
                position: this.official.position
            });
            if (this.official.picture) {
                this.previewImage = this.official.picture;
            }
        }
    }

    initForm() {
        this.officialForm = this.fb.group({
            name: ['', Validators.required],
            position: ['', Validators.required]
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                // You might want to show an alert here, but for now we'll just ignore
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.previewImage = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    cancel() {
        this.modalController.dismiss(null, 'cancel');
    }

    save() {
        if (this.officialForm.valid) {
            const data = {
                ...this.officialForm.value,
                picture: this.previewImage
            };
            this.modalController.dismiss(data, 'confirm');
        }
    }
}
