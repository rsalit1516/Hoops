import {
  Component,
  OnInit,
  ElementRef,
  Inject,
  signal,
  ChangeDetectionStrategy,
  inject,
  viewChildren
} from '@angular/core';
import {
  Validators,
  FormControl,
  FormBuilder,
  ReactiveFormsModule
} from '@angular/forms';

import { Content } from '../../../../domain/content';
import { ContentService } from '../../content.service';
import { Store, select } from '@ngrx/store';

import * as fromContent from '@app/admin/state';
import * as contentActions from '@app/admin/state/admin.actions';

import { WebContentType } from '@app/domain/webContentType';
import { FloatLabelType } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/admin/shared/confirm-dialog/confirm-dialog.component';
import { Constants } from '@app/shared/constants';
import { State } from '../../../state/index';
import { WebContent } from '@app/domain/webContent';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'csbc-content-edit',

  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './content-edit.component.html',
  styleUrls: [
    './content-edit.component.scss',
    '../../../admin.component.scss',
    '../../../../shared/scss/forms.scss',
    '../../../../shared/scss/cards.scss',
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDatepickerModule,
    MatDividerModule,
    MatOptionModule,
    MatButtonModule,
    MatSelectModule,
    ConfirmDialogComponent,
  ],
  providers: [ ContentService ]
})
export class ContentEditComponent implements OnInit {
  readonly store = inject(Store<fromContent.State>);
  private fb = inject(FormBuilder);
  contentService = inject(ContentService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  dialog = inject(MatDialog);

  contentForm = this.fb.group({
    title: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ],
      nonNullable: true,
    }),
    subTitle: new FormControl('', [Validators.maxLength(50)]),
    body: new FormControl<string | null>(''),
    location: new FormControl<string | null>(''),
    dateAndTime: new FormControl<string | null>(''),
    webContentId: new FormControl<number>(0),
    webContentTypeControl: new FormControl<number>(1),
    contentSequence: new FormControl<number>(1),
    expirationDate: new FormControl<Date | null>(
      new Date(),
      Validators.required
    ),
  });
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
  floatLabelType: FloatLabelType = 'auto';
  protected readonly value = signal('');

  constructor (
    // @Inject(FormBuilder) private fb: FormBuilder,

  ) { }

  ngOnInit (): void {
    this.pageTitle = 'Edit Web Content Messages';
    this.hideId = true;

    // this.record$.pipe(takeUntil(this.destroy$)).subscribe((record) => {
    //   if (record) { this.recordForm.patchValue(record); }
    // });
    this.getContent();
  }

  update (): void {
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
  getContent (): void {
    this.store
      .pipe(select(fromContent.getSelectedContent))
      .subscribe((content) => {
        if (content !== null) {
          this.selectedContent = content;
          this.onContentRetrieved(content);
        }
      });
  }
  onContentRetrieved (content: Content): void {
    if (this.contentForm) {
      this.contentForm.reset();
    }

    if (content.webContentId === 0) {
      this.pageTitle = 'Add Notice';
    } else {
      this.pageTitle = `Edit Notice: ${ content.title }`;
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
  saveContent () {
    console.log(this.contentForm.value);
    if ( this.contentForm.valid && this.contentForm.dirty ) {
      let content = new WebContent();
      const form = this.contentForm.value;
      // content.webContentType = this.getWebContentType(
      //   contentForm.webContentType.Web
      // );
      content.webContentTypeId = form.webContentTypeControl!;
      content.webContentId = form.webContentId === null ? 0 : form.webContentId;
      // console.log(content);
      content.title = form.title!;
      content.subTitle = form.subTitle!;
      content.body = form.body!;
      content.dateAndTime = form.dateAndTime!;
      content.location = form.location!;
      content.expirationDate = form.expirationDate!;
      content.contentSequence = form.contentSequence!;
      content.companyId = Constants.COMPANYID;
      content.webContentTypeId = form.webContentTypeControl!;
      this.contentService.saveContent(content);
      this.store.dispatch(new contentActions.SetAllContent());
      this.router.navigate([ '/admin/content' ]);
    }
  }
  getWebContentType (id: number): WebContentType {
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

  getFloatLabelValue (): FloatLabelType {
    return this.floatLabelType;
  }
  protected onInput (event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }
  deleteRecord (): void {
    console.log(this.contentForm.get('webContentId')!.value);
    if (this.contentForm.get('webContentId')!.value !== 0) {
      this.contentService.deleteContent(
        this.contentForm.get('webContentId')!.value!
      );
      // this.onSaveComplete();
    }
  }
  openDialog (): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.deleteRecord();
      }
    });
  }
  isFormDirty(): boolean {
    return this.contentForm.dirty;
  }
}
