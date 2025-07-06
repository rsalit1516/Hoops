# Admin People Module

## Purpose

Provide administrative users with tools to manage the people in the league database, including their personal information, household relationships, and league participation history.

## Key Capabilities

- **Search by Name**: Filter people by partial or full name input
- **Search by first letter**: Offer the option of viewing the list of people by the first letter of their last name
- **View Person Details**: See an individual's household, league data, and participation history
- **CRUD Operations**: Add, edit, and delete people records
- **Admin Access Only**: Restrict usage of this feature to authorized admin users
- **Pagination**: let users go through multiple pages

## Relationships Modeled

- A `Person` belongs to one `Household`
- A `Household` can contain multiple `People`
- A `Person` can be associated with multiple `Seasons` over time (active and historical)

## Notes

This module integrates tightly with domain models (`Person`, `Household`, `Season`, `Player`), and acts as an administrative portal for data hygiene and oversight. All changes should be tracked with user audit metadata for accountability.
