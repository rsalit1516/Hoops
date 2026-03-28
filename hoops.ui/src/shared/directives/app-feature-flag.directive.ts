import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { FeatureFlagService } from '../services/feature-flags';

@Directive({
  selector: '[appFeatureFlag]'
})
export class AppFeatureFlagDirective {
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  private featureFlagService = inject(FeatureFlagService);

  @Input() set appFeatureFlag (flagName: string) {
    const isEnabled = this.featureFlagService.isEnabled(flagName);
    this.viewContainer.clear();

    if (isEnabled) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor () { }
}
