# Feature: Display playoff games

Description: Playoff games are created for most divisions (but not all divisions) created for tournament style where the best team in the division plays the worst, the second best plays the second to last place team and so forth. Winners continue on. 

Business Value: Playoffs enable users to view the playoff schedule

## Scenario: List playoff games by division

Given I have selected a division
Then I should see a list of playoff games with scores
And they should be sorted by date and time
