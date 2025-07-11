import { AppFeatureFlagDirective } from './app-feature-flag.directive';

describe('AppFeatureFlagDirective', () => {
  it('should create an instance', () => {
    const mockTemplateRef = {} as any;
    const mockViewContainer = {} as any;
    const directive = new AppFeatureFlagDirective(mockTemplateRef, mockViewContainer);
    expect(directive).toBeTruthy();
  });
});
