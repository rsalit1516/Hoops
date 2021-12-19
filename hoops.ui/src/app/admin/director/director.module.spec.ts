import { DirectorModule } from './director.module';

describe('DirectorModule', () => {
  let directorModule: DirectorModule;

  beforeEach(() => {
    directorModule = new DirectorModule();
  });

  it('should create an instance', () => {
    expect(directorModule).toBeTruthy();
  });
});
