# User login - User Stories

## User login - Verify user
As a user, I want to be able to login to the app so that I can be authenticated and authorized for relevant permissions

### Acceptance Criteria
- If a user is not logged in, a button will appear in the upper right labeled "Login".
- When the Login button is clicked a page titled "Login", will be presented to the user to provide their user name and password.
- using the API endpoint route "login/{userName}/{password}" the email / password combination is submitted
- if the user name / password combination is invalid an error, "Invalid username or password." will be returned.
- if the user name / password is valid, a dataset is returned in the structure of UserVm.
