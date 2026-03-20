# Users seeding - User Stories

## User seeding - basic list
As an admin user, I want to create a sample list of users.

### Acceptance Criteria

- 3 users should be created who are UserType = 3, these will have access to the admin module (in progress)
- Users should have a link to a People record with Parent = 1 (true) in the People table (this may require a modification to the PeopleAndHousehold seeding)
- There are at least 5 user reocrds who are of user type 2 
- Division seeding records should have a link to a People record who are parents and have a user account
- should follow the seeding framework established for other entities
- appropriateunit tests are created.