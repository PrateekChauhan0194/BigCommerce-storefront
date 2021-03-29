Feature: This feature is to validate the product page
  @test
  Scenario: Verify that the Product page loads and the header is visible
    Given I am on product page
    Then I validate that the main container for product page is present