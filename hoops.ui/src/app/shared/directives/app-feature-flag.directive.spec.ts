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

    const mockTemplateRef = {} as any; // not used beyond passing through
    const mockViewContainer = {
      clear: jasmine.createSpy('clear'),
      createEmbeddedView: jasmine.createSpy('createEmbeddedView'),
    } as any;

    let directive: AppFeatureFlagDirective;
    TestBed.configureTestingModule({
      providers: [{ provide: FeatureFlagService, useValue: featureFlags }],
    });

    TestBed.runInInjectionContext(() => {
      directive = new AppFeatureFlagDirective(
        mockTemplateRef,
        mockViewContainer
      );
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
