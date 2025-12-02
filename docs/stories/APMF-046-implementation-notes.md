# APMF-046 Implementation Notes

## Story: View Directors List

**Status**: ✅ Implemented  
**Date**: 2025-06-01  
**Implemented By**: AI Assistant

## Overview

Implemented a full-featured Angular Material table for displaying directors with sorting, pagination, and proper styling following the project's conventions.

## Files Modified

### 1. director-list.ts

**Path**: `hoops.ui/src/app/admin/director/component/director-list/director-list.ts`

**Key Changes**:

- Added `AfterViewInit` lifecycle hook implementation
- Added `MatSort` and `MatPaginator` with `@ViewChild` decorators
- Imported `MatButtonModule`, `MatSortModule`, `MatPaginatorModule`
- Added signal-based effect to auto-update table when directors change
- Implemented custom sort accessor for the name column (lastName, firstName)
- Added methods:
  - `getDirectorName()` - Combines firstName and lastName
  - `loadDirectors()` - Fetches directors from service
  - `editDirector()` - Navigate to edit form (placeholder)
  - `addDirector()` - Navigate to add form (placeholder)
  - `refreshList()` - Reload directors data
- Configured default sort: name column, ascending
- Added error message support
- Set page size to 25 with options [10, 25, 50, 100]

**Technical Details**:

- Uses `MatTableDataSource<Director>` for proper typing
- Binds paginator and sort in `ngAfterViewInit()`
- Supports both `@Input()` directors and service-based loading
- Uses Angular signals with `effect()` for reactive updates
- Removed console.log statements to satisfy ESLint rules

### 2. director-list.html

**Path**: `hoops.ui/src/app/admin/director/component/director-list/director-list.html`

**Key Changes**:

- Complete rewrite from basic table to full-featured Angular Material table
- Added table header with title and "Add Director" button
- Implemented two columns:
  - **Name**: Displays full name (firstName + lastName) with sorting
  - **Title**: Displays director title with sorting and "N/A" fallback
- Added `mat-sort-header` directives for sortable columns
- Added `mat-paginator` with configuration:
  - Page size: 25
  - Page size options: [10, 25, 50, 100]
  - First/last page buttons enabled
  - Accessibility label
- Added clickable rows that trigger `editDirector()`
- Added "No directors found" message for empty state
- Added error message display with `@if` control flow
- Added proper ARIA attributes for accessibility

### 3. director-list.scss

**Path**: `hoops.ui/src/app/admin/director/component/director-list/director-list.scss`

**Key Changes**:

- Added `.director-list-container` wrapper styling
- Added `.table-header` with flexbox layout for title and button
- Added `.error-message` styling with red theme
- Added `.table-container` with white background and shadow
- Added `.clickable-row` with hover effect
- Added `.no-data-row` styling for empty state
- Maintains brand color usage from variables

## Implementation Highlights

### Follows Project Conventions

✅ Uses Angular 18+ standalone component pattern  
✅ References `tables.scss` for consistent table styling  
✅ Uses signals and effects for reactive state management  
✅ Follows ContentList component pattern (reference implementation)  
✅ Uses Angular Material components throughout  
✅ Proper TypeScript typing with `Director` model

### Data Handling

- **Name Column**: Displays full name by combining `firstName` and `lastName` fields from the Director model
- **Title Column**: Displays the `title` field directly from the Director model
- **People Table Reference**: The Director model has a `peopleId` field that references the People table. The current implementation displays firstName/lastName stored directly on the Director record. If name data needs to be fetched from the People table, this would require:
  1. Creating/updating a PeopleService
  2. Joining data in the DirectorService or backend API
  3. Expanding the Director model to include resolved People data

### Sorting Functionality

- Default sort: Name column, ascending
- Custom sort accessor combines lastName and firstName for proper name sorting
- Both columns are sortable via `mat-sort-header` directives
- Sort state persists across data updates

### Pagination Functionality

- Default page size: 25 records
- Page size options: 10, 25, 50, 100
- First/Last page navigation buttons enabled
- Accessibility label for screen readers
- Paginator state persists across data updates

### Error Handling

- Error message display area in template
- Service integration ready for error states
- User-friendly error messages with proper styling

### Accessibility

- ARIA labels on paginator
- Proper semantic HTML structure
- Role attributes for alerts
- Keyboard navigation support via Material components

## Testing Considerations

### Manual Testing Checklist

- [ ] Table displays directors with name and title columns
- [ ] Clicking column headers toggles sort direction
- [ ] Sorting by name works correctly (lastName, firstName)
- [ ] Sorting by title works correctly
- [ ] Pagination controls work (next, prev, first, last)
- [ ] Page size selector updates table correctly
- [ ] "No directors found" message appears when empty
- [ ] Clicking a row triggers editDirector (currently logs to console)
- [ ] "Add Director" button triggers addDirector (currently logs to console)
- [ ] Table styling matches other admin tables (via tables.scss)
- [ ] Responsive layout works on different screen sizes

### BDD Test Scenarios

See `docs/features/apm/APMF-046-create-list-for-directors-in-admin.feature` for comprehensive test scenarios covering:

- Smoke tests (basic display)
- Sorting functionality
- Pagination functionality
- Edge cases (empty state, single record)
- Error handling
- Accessibility compliance

## Next Steps

### Immediate Follow-ups

1. **Implement Navigation**:

   - Uncomment router navigation in `editDirector()` method
   - Uncomment router navigation in `addDirector()` method
   - Create director edit and add routes

2. **Implement APMF-047**: Add Director (Create form)
3. **Implement APMF-048**: Edit Director (Update form)
4. **Implement APMF-049**: Delete Director (Delete functionality)

### Future Enhancements

- Add search/filter functionality
- Add bulk operations (delete multiple)
- Add export functionality (CSV, Excel)
- Add director photo display in table
- Implement People table name resolution if firstName/lastName should come from People instead of Director
- Add column visibility toggle
- Add column reordering
- Add director details preview on hover

## Notes

### People Table Reference

The Director model includes a `peopleId` field that references the People table. The current implementation uses `firstName` and `lastName` fields stored directly on the Director record. If the requirement is to display name data from the referenced People record instead, additional implementation would be needed:

1. **Option A - Service Layer Join**:

   ```typescript
   // In DirectorService
   fetchDirectorsWithPeople(): Observable<Director[]> {
     return forkJoin({
       directors: this.httpClient.get<Director[]>('/api/directors'),
       people: this.httpClient.get<Person[]>('/api/people')
     }).pipe(
       map(({ directors, people }) => {
         return directors.map(director => ({
           ...director,
           personName: people.find(p => p.id === director.peopleId)?.name
         }));
       })
     );
   }
   ```

2. **Option B - Backend Join**:

   - Update the backend API to include People data in the Director response
   - Expand the Director DTO to include resolved name from People table

3. **Option C - Separate Service Calls**:
   - Use PeopleService to fetch person details on demand
   - Cache person data to avoid redundant calls

### ESLint Configuration

The project has ESLint configured to disallow console.log statements (only console.warn and console.error are allowed). All placeholder implementations use commented-out navigation instead of console logging.

## Related Documentation

- **Story Document**: `docs/stories/APMF-046-create-list-for-directors-in-admin.md`
- **BDD Feature**: `docs/features/apm/APMF-046-create-list-for-directors-in-admin.feature`
- **Feature Document**: `docs/features/apm/APMF-046-director-management.md`
- **Epic Document**: `docs/epics/APM-045-admin-people-management.md`
- **Reference Implementation**: `hoops.ui/src/app/admin/content/component/content-list/content-list.ts`
- **Styling Reference**: `hoops.ui/src/app/shared/scss/tables.scss`
