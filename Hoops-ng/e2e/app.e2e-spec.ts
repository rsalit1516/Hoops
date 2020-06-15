import { CsbcNg3Page } from './app.po';

describe('csbc-ng3 App', function() {
  let page: CsbcNg3Page;

  beforeEach(() => {
    page = new CsbcNg3Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
