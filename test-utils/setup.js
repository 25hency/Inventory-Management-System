const { setDefaultTimeout } = require('jest');

// Increase default timeout for e2e tests
jest.setTimeout(30000);

// Add Jest specific matchers for Selenium if needed
expect.extend({
  async toBeVisible(received) {
    if (!received) {
      return {
        message: () => 'Element not found',
        pass: false
      };
    }
    
    const isDisplayed = await received.isDisplayed();
    return {
      message: () => 
        `Expected element ${isDisplayed ? 'not ' : ''}to be visible`,
      pass: isDisplayed
    };
  }
});

// Add any other global test setup here
