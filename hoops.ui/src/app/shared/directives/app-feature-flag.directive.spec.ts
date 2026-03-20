import { TemplateRef, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppFeatureFlagDirective } from './app-feature-flag.directive';
import { FeatureFlagService } from '../services/feature-flags';

describe('AppFeatureFlagDirective', () => {
  function createDirective(featureEnabled: boolean) {
    const featureFlags = jasmine.createSpyObj<FeatureFlagService>(
      'FeatureFlagService',
      ['isEnabled']
    );
    (featureFlags.isEnabled as any).and.returnValue(featureEnabled);

    const mockTemplateRef = {} as any;
    const mockViewContainer = {
      clear: jasmine.createSpy('clear'),
      createEmbeddedView: jasmine.createSpy('createEmbeddedView'),
    } as any;

    let directive: AppFeatureFlagDirective;
    TestBed.configureTestingModule({
      providers: [
        { provide: FeatureFlagService, useValue: featureFlags },
        { provide: TemplateRef, useValue: mockTemplateRef },
        { provide: ViewContainerRef, useValue: mockViewContainer },
      ],
    });

    TestBed.runInInjectionContext(() => {
      directive = new AppFeatureFlagDirective();
      // trigger setter
      (directive as any).appFeatureFlag = 'adminModule';
    });

    return { directive: directive!, mockViewContainer, featureFlags };
  }

  it('creates embedded view when flag enabled', () => {
    const { mockViewContainer } = createDirective(true);
    expect(mockViewContainer.clear).toHaveBeenCalled();
    expect(mockViewContainer.createEmbeddedView).toHaveBeenCalled();
  });

  it('does not create embedded view when flag disabled', () => {
    const { mockViewContainer } = createDirective(false);
    expect(mockViewContainer.clear).toHaveBeenCalled();
    expect(mockViewContainer.createEmbeddedView).not.toHaveBeenCalled();
  });
});
