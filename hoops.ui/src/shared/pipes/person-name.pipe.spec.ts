import { PersonNamePipe } from './person-name.pipe';

describe('PersonNamePipe', () => {
  const pipe = new PersonNamePipe();

  it('should format as "Last, First"', () => {
    expect(pipe.transform({ lastName: 'Smith', firstName: 'Jane' })).toBe('Smith, Jane');
  });

  it('should handle empty strings', () => {
    expect(pipe.transform({ lastName: '', firstName: '' })).toBe(', ');
  });
});
