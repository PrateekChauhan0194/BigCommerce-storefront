Feature: This feature is to validate the Cart page
  @test
  Scenario: Verify that the Cart page loads and the header is visible
    Given I am on cart page
    Then I validate that the main container for cart page is present