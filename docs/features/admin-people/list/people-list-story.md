# Feature: List for Admin People Module

## Goal

Display a list of people based on filters set in other components where users can click on a person to view their details or click on a button to Register the person for the current season.

## Personas

- **Admin**: League organizer responsible for managing player and coach data.
- **Agent**: Automation assistant used to generate feature code and tests.

## User Stories

- As an Admin, I want to click on a row to be able to view the person's detail info (see people-detail story).
- As an Admin user, I want to be able click on a "Register" button for that row which will bring me to a page to allow the registration for that person. That should only be available for those people designated as players (see "admin-register-payments").
- As an Admin, I want the list of people to be paginated, showing 10 people by default but selectable for 25 or 50 people.

## Assumptions

- People have last names stored and indexed.

## Constraints

- Must be responsive and usable across device sizes.

## Acceptance Criteria

Covered in companion BDD file: `people-list.feature`
