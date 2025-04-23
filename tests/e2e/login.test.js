const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

const service = new chrome.ServiceBuilder("C:\\Users\\Hency\\Downloads\\chromedriver-win64\\chromedriver.exe");

describe('Login Flow Tests', () => {
  let driver;
  let wait;

  beforeAll(async () => {
    const options = new chrome.Options();
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .setChromeOptions(options)
      .build();

    await driver.manage().window().maximize();
    wait = driver.wait.bind(driver);
    await driver.manage().setTimeouts({ implicit: 5000 });
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async () => {
    await driver.get('http://localhost:3000/login');
    await wait(until.elementLocated(By.css('input[placeholder="Enter Email Address"]')), 10000);
  });

  const loginHelper = async (email, password) => {
    const emailInput = await driver.findElement(By.css('input[placeholder="Enter Email Address"]'));
    const passwordInput = await driver.findElement(By.css('input[placeholder="Enter Password"]'));

    await emailInput.clear(); 
    await passwordInput.clear();

    await emailInput.sendKeys(email);
    await passwordInput.sendKeys(password);

    const loginButton = await driver.findElement(By.css('button.add-new'));
    await loginButton.click();
  };

  test('should show error for invalid credentials', async () => {
    await loginHelper('invalid@example.com', 'wrongpass');

    const errorMessage = await wait(
      until.elementLocated(By.className('ant-message-notice-content')), 
      5000
    );
    await wait(until.elementIsVisible(errorMessage), 5000);

    const messageText = await errorMessage.getText();
    console.log("Error message text:", messageText);
    expect(messageText).toContain('Login Failed!');

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toBe('http://localhost:3000/login');
  }, 30000);

  test('should successfully login with valid credentials', async () => {
    await loginHelper('admin@gmail.com', '12345');

    const successMessage = await wait(
      until.elementLocated(By.className('ant-message-notice-content')),
      10000
    );
    await wait(until.elementIsVisible(successMessage), 5000);

    const messageText = await successMessage.getText();
    console.log("Login success message:", messageText);
    expect(messageText).toContain('User Login Successfully!');

    await wait(until.urlIs('http://localhost:3000/'), 10000);

    const sidebar = await driver.findElement(By.className('ant-layout-sider'));
    expect(await sidebar.isDisplayed()).toBeTruthy();

    const authData = await driver.executeScript('return localStorage.getItem("auth");');
    expect(authData).toBeTruthy();
  }, 30000);

}); // End of describe block
