@itests @categories
Feature: This feature is to validate the categories page

  Scenario: Verify that the Categories page loads and the header is visible
    Given I am on categories page
    Then I validate that the main container for categories page is present