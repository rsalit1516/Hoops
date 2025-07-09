# Feature: Filter for listing people in the admin module

## Goal
  - enable users to easily filter the people list by last name, first name and whether they are a player.

## Personas

- **Admin**: League organizer responsible for managing player and coach data.
- **Agent**: Automation assistant used to generate feature code and tests.

## User Stories

- As an Admin user, I want to be able to filter the list of people based on inputting parts or full last names and first names.
- As an Admin user, I want to be able to filter any filtered list by only those people who were players in the league.
- As an admin, I want to be able to clear the filters and the system will default to the list of people whose last name starts with the letter 'A'. (see Alphabet-story).


## Assumptions

- People have last names stored and indexed.
- Alphabet filter is server-side and fetches new data and removes existing filters.
- State persistence (e.g., active letter) is stored via localStorage.

## Constraints

- Must not interfere with existing list filters (e.g., search bar, role type).
- Must be responsive and usable across device sizes.

## Acceptance Criteria

Covered in companion BDD file: `people-filter.feature`
