- @azure Rule - Use Azure Best Practices: When generating code for Azure, running terminal commands for Azure, or performing operations related to Azure, invoke your `azure_development-get_best_practices` tool if available.

- Frontend testing direction: For Angular unit tests in `hoops.ui`, prefer Vitest-compatible patterns for all new or substantially rewritten tests.
- Current repo state: The existing test runner is still Jasmine/Karma. Do not do piecemeal runner conversions that leave the workspace in a mixed broken state.
- When touching existing Jasmine specs before the runner migration is complete, keep them runnable under the current setup unless the task explicitly includes migrating the test configuration.
- Avoid introducing new Jasmine-only helpers when a straightforward Angular TestBed plus framework-agnostic assertion/spying pattern will work.
