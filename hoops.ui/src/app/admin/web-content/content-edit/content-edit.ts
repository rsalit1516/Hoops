import {
  Component,
  OnInit,
  signal,
  ChangeDetectionStrategy,
  inject,
  computed,
  effect,
  ChangeDetectorRef,
} from '@angular/core';
import {
  Validators,
  FormControl,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

import { Content } from '../../../domain/content';
import { ContentService } from '../content.service';
import { Store } from '@ngrx/store';

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
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '@app/admin/shared/confirm-dialog/confirm-dialog';
import { Constants } from '@app/shared/constants';
import { WebContent } from '@app/domain/webContent';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NoticeTypesService } from '@app/shared/services/notice-types.service';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-content-edit',

  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './content-edit.html',
  styleUrls: [
    './content-edit.scss',
    '../../admin.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
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
    ConfirmDialog,
  ],
  providers: [provideNativeDateAdapter()],
})
export class ContentEdit implements OnInit {
  readonly store = inject(Store<fromContent.State>);
  private fb = inject(FormBuilder);
  readonly contentService = inject(ContentService);
  readonly noticeTypesSvc = inject(NoticeTypesService);
  private cdRef = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  dialog = inject(MatDialog);
  private logger = inject(LoggerService);

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
    // Start as null so the UI doesn't flash a default before the actual value is applied
    webContentTypeControl: new FormControl<number | null>(null),
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
  // Direct reference to the signal from the service (assumes service exposes a signal<WebContent | null>)
  // If the service instead exposes a getter function, adapt accordingly.
  selectedContent = this.contentService.selectedContent;
  // Content types from API via httpResource. Expose as a signal-friendly computed.
  contentTypes = computed(() => {
    const raw = this.noticeTypesSvc.notificationTypes.value() ?? [];
    // Ensure ids are numeric so strict equality works with the FormControl value
    return raw.map((t: any) => ({
      ...t,
      webContentTypeId: Number(t.webContentTypeId),
    })) as WebContentType[];
  });
  selected!: WebContentType;
  webContent = 'Web Content';
  expirationDate = 'Expiration Date';
  location = 'Location';
  contentSequence = 'Content Order';
  floatLabelType: FloatLabelType = 'auto';
  protected readonly value = signal('');

  constructor() {
    // Populate form when a new content selection arrives
    effect(() => {
      const current = this.selectedContent();
      if (current) {
        this.onContentRetrieved(current);
      }
    });
    // After both resource resolved and content loaded, ensure select control reflects correct id
    effect(() => {
      const status = this.noticeTypesSvc.notificationTypes.status();
      const current = this.selectedContent();
      if (status === 'resolved' && current) {
        // Compute id robustly: prefer explicit id; fallback to nested object id; finally map by description
        const fromId = this.toNumber((current as any).webContentTypeId);
        const fromObj = this.toNumber(
          (current as any).webContentType?.webContentTypeId
        );
        let id = fromId ?? fromObj;
        if (id === null || id === undefined) {
          const desc =
            (current as any).webContentTypeDescription ??
            (current as any).webContentType?.webContentTypeDescription;
          if (desc) {
            const norm = (s: unknown) => s?.toString().trim().toLowerCase();
            const match = this.contentTypes().find(
              (t) => norm(t.webContentTypeDescription) === norm(desc)
            );
            if (match) id = match.webContentTypeId;
          }
        }
        const ctl = this.contentForm.get('webContentTypeControl');
        if (!ctl) return;
        // Ensure control is enabled before setting value
        if (ctl.disabled) ctl.enable({ emitEvent: false });
        if (id !== null && id !== undefined && ctl.value !== id) {
          ctl.setValue(id, { emitEvent: false });
          ctl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
          this.cdRef.markForCheck();
        }
      }
    });
    // Enable/disable the select control based on resource loading status (moved from template)
    effect(() => {
      const status = this.noticeTypesSvc.notificationTypes.status();
      const ctl = this.contentForm.get('webContentTypeControl');
      if (!ctl) return;
      if (status === 'loading' || status === 'reloading') {
        if (ctl.enabled) ctl.disable({ emitEvent: false });
      } else {
        if (ctl.disabled) ctl.enable({ emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.pageTitle = 'Edit Web Content Messages';
    this.hideId = true;
  }

  update(): void {
    this.contentForm.patchValue({
      title: this.content.title,
      subTitle: this.content.subTitle,
      body: this.content.body,
      dateAndTime: this.content.dateAndTime,
      location: this.content.location,
      expirationDate: this.content.expirationDate,
      webContentTypeControl: this.content.webContentTypeId,
    });
    const text = this.contentForm.get('body')?.value;
    const formattedText = this.formatText(text ?? '');
    // Use formattedText where needed
    this.logger.info(formattedText);
  }
  formatText(text: string): string {
    return text.replace(/\n/g, '<br>');
  }
  // getContent (): void {
  //   this.store
  //     .pipe(select(fromContent.getSelectedContent))
  //     .subscribe((content) => {
  //       if (content !== null) {
  //         this.selectedContent = content;
  //         this.onContentRetrieved(content);
  //       }
  //     });
  // }
  onContentRetrieved(content: WebContent): void {
    // Avoid full reset (which clears validators states and temporarily nulls controls) unless specifically needed.
    // Instead patch values directly.
    this.pageTitle =
      content.webContentId === 0
        ? 'Add Notice'
        : `Edit Notice: ${content.title}`;
    this.logger.info(content);
    this.contentForm.patchValue(
      {
        title: content.title,
        subTitle: content.subTitle,
        body: content.body,
        dateAndTime: content.dateAndTime,
        location: content.location,
        expirationDate: content.expirationDate,
        webContentId: content.webContentId,
        contentSequence: content.contentSequence,
        // Do NOT set webContentTypeControl here; let the effect set it once types are resolved
      },
      { emitEvent: false }
    );
    this.selected = content.webContentType;
  }
  saveContent() {
    this.logger.info(this.contentForm.value);
    if (this.contentForm.valid && this.contentForm.dirty) {
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
      this.store.dispatch(new contentActions.LoadAdminContent());
      this.router.navigate(['/admin/content']);
    }
  }
  getWebContentType(id: number): WebContentType {
    let webContentType = new WebContentType();
    this.logger.info(id);
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

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelType;
  }
  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }
  toNumber(val: unknown): number | null {
    if (val === null || val === undefined || val === '') return null;
    return typeof val === 'number' ? val : Number(val);
  }
  deleteRecord(): void {
    this.logger.info(this.contentForm.get('webContentId')!.value);
    if (this.contentForm.get('webContentId')!.value !== 0) {
      this.contentService.deleteContent(
        this.contentForm.get('webContentId')!.value!
      );
      // this.onSaveComplete();
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialog);

    dialogRef.afterClosed().subscribe((result) => {
      this.logger.info(result);
      if (result) {
        this.deleteRecord();
      }
    });
  }
  isFormDirty(): boolean {
    return this.contentForm.dirty;
  }
}
