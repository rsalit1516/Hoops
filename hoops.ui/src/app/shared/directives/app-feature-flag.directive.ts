import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { FeatureFlagService } from '../services/feature-flags';

@Directive({
  selector: '[appFeatureFlag]'
})
export class AppFeatureFlagDirective {
  private featureFlagService = inject(FeatureFlagService);

  @Input() set appFeatureFlag (flagName: string) {
    const isEnabled = this.featureFlagService.isEnabled(flagName);
    this.viewContainer.clear();

    if (isEnabled) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
  constructor (
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef
  ) { }
}
