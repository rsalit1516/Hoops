import {
  Component,
  OnInit,
  ViewChildren,
  ElementRef,
  Inject,
} from '@angular/core';
import {
  Validators,
  FormControlName,
  FormControl,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Content } from '../../../../domain/content';
import { ContentService } from '../../content.service';
import { Store, select } from '@ngrx/store';

import * as fromContent from '../../state';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { WebContentType } from 'app/domain/webContentType';

@Component({
  selector: 'csbc-content-edit',
  templateUrl: './content-edit.component.html',
  styleUrls: ['./content-edit.component.scss', '../../../admin.component.scss'],
})
export class ContentEditComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  @Inject(MAT_DIALOG_DATA)

  // @Input()
  content!: Content;
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
  webContent = 'Web Content';
  expirationDate = 'Expiration Date';
  location = 'Location';
  contentSequence = 'Content Order';

  contentForm = new FormGroup({
    title: new FormControl<string | null>('',
      {
        validators:
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        nonNullable: true
      }),

    subTitle: new FormControl('', [Validators.maxLength(50)]),
    body: new FormControl<string | null>(''),
    location: new FormControl<string | null>(''),
    dateAndTime: new FormControl<string | null>(''),
    webContentId: new FormControl<number>(0),
    webContentTypeControl: new FormControl<number>(1),
    contentSequence: new FormControl<number>(1),
    expirationDate: new FormControl<Date | null>(new Date(), Validators.required),
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromContent.State>,
    private contentService: ContentService
) {
  }

  ngOnInit(): void {
    this.pageTitle = 'Edit Web Content Messages';
    this.hideId = true;
    this.getContent();
  }

  update(): void {
    this.contentForm.patchValue({
      title: this.selectedContent.title,
      subTitle: this.selectedContent.subTitle,
      body: this.content.body,
      dateAndTime: this.content.dateAndTime,
      location: this.content.location,
      expirationDate: this.content.expirationDate,
      // webContentTypeControl: this.content.webContentType,
    });
  }
  getContent(): void {
    this.store
      .pipe(select(fromContent.getSelectedContent))
      .subscribe((content) => {
        if (content !== null) {
          this.selectedContent = content;
          this.onContentRetrieved(content);
        }
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
      contentSequence: content.contentSequence,
      webContentTypeControl: content.webContentTypeId,
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
    return '';
    // this.contentForm.controls[ controlName ].hasError(errorName);
  };
}
