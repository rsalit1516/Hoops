import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Content } from '../../domain/content';

@Component({
    selector: 'csbc-content-edit',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})

export class ContentComponent implements OnInit {
    @Input() content: Content;
    contentForm: FormGroup;


    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.contentForm = this.fb.group({
            title: ['Test', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            subTitle: '',
            body: '',
            location: '',
            dateAndTime: '',
            webContentTypeId: ''
        });
    }

    update(): void {
        this.contentForm.patchValue({
            title: this.content.title,
            subTitle: this.content.subTitle,
            body: this.content.body
        });
    }

    save() {

    }
}
