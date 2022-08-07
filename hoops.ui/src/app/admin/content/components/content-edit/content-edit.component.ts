import {
  Component,
  OnInit,
  ViewChildren,
  ElementRef,
  Inject,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormControlName,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Content } from '../../../../domain/content';
import { ContentService } from '../../content.service';
import { Store, select } from '@ngrx/store';

import * as fromContent from '../../state';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebContentType } from 'app/domain/webContentType';

@Component({
  selector: 'csbc-content-edit',
  templateUrl: './content-edit.component.html',
  styleUrls: ['./content-edit.component.scss', '../../../admin.component.scss'],
})
export class ContentEditComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  @Inject(MAT_DIALOG_DATA)
  // formInputElements: ElementRef[];

  // @Input()
  content!: Content;
  contentForm!: UntypedFormGroup;
  errorMessage: string | undefined;
  pageTitle: string | undefined;
  hideId: boolean | undefined;
  private baseUrl = 'api/webcontent';
  selectedRecord$ = this.contentService.selectedContent$;
  selectedContent!: Content;
  contentTypes: WebContentType[] = [
    {
      webContentTypeId: 1,
      webContentTypeDescription: 'Season Info',
    },
    {
      webContentTypeId: 2,
      webContentTypeDescription: 'Events',
    },
    {
      webContentTypeId: 3,
      webContentTypeDescription: 'Meeting Notice',
    },
  ];
  selected!: WebContentType;

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromContent.State>,
    private contentService: ContentService
  ) {}


  ngOnInit(): void {
    this.contentForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      subTitle: ['', [Validators.maxLength(50)]],
      body: '',
      location: '',
      dateAndTime: '',
      webContentId: '',
      webContentTypeControl: null,
      contentSequence: 1,
      expirationDate: [new Date(), Validators.required],
    });
    this.pageTitle = 'Edit Web Content Messages';
    this.hideId = true;
    this.getContent();
  }

  update(): void {
    this.contentForm.patchValue({
      title: this.content.title,
      subTitle: this.content.subTitle,
      body: this.content.body,
      dateAndTime: this.content.dateAndTime,
      location: this.content.location,
      expirationDate: this.content.expirationDate,
      webContentTypeControl: this.content.webContentType,
    });
  }
  getContent(): void {
    this.store
      .pipe(select(fromContent.getSelectedContent))
      .subscribe((content) => {
        this.selectedContent = content;
        this.onContentRetrieved(content);
      });
  }
  onContentRetrieved(content: Content): void {
    console.log(content);
    if (this.contentForm) {
      this.contentForm.reset();
    }

    if (content.webContentId === 0) {
      this.pageTitle = 'Add Notice';
    } else {
      this.pageTitle = `Edit Notice: ${content.title}`;
    }

    // // Update the data on the form
    this.contentForm.patchValue({
      title: content.title,
      subTitle: content.subTitle,
      body: content.body,
      dateAndTime: content.dateAndTime,
      location: content.location,
      expirationDate: content.expirationDate,
      webContentId: content.webContentId,
      webContentTypeControl: content.webContentType,
    });
    this.selected = content.webContentType;
    console.log(this.selected);
  }
  saveContent() {
    console.log(this.contentForm.value);
    if (this.contentForm.dirty) {
      this.contentService.saveContent(this.contentForm.value);
      this.router.navigate(['/admin/content']);
    }
  }
  getWebContentType(id: number): WebContentType {
    let webContentType = new WebContentType();
    console.log(id);
    switch (id) {
      case 1: {
        webContentType.webContentTypeId = id;
        webContentType.webContentTypeDescription = 'Season Info';
        break;
      }
      case 2: {
        webContentType.webContentTypeId = id;
        webContentType.webContentTypeDescription = 'Season Info';
        break;
      }
      case 3: {
        webContentType.webContentTypeId = id;
        webContentType.webContentTypeDescription = 'Meeting Notice';
        break;
      }
      default: {
        webContentType.webContentTypeId = id;
        webContentType.webContentTypeDescription = 'Season Info';
      }
    }
    return webContentType;
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.contentForm.controls[controlName].hasError(errorName);
  };
}
