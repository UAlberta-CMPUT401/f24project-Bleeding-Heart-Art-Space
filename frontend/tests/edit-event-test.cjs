const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

// Helper function to clear a field value
async function clearField(driver, elementLocator) {
  const inputField = await driver.findElement(elementLocator);
  const value = await inputField.getAttribute('value');

  for (let i = 0; i < value.length; i++) {
    await inputField.sendKeys(Key.BACK_SPACE);
  }
}

describe('edit-event-test', function() {
  this.timeout(60000);
  let driver;
  let vars;

  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    vars = {};
  });

  afterEach(async function() {
    await driver.quit();
  });

  it('edit-event-test', async function() {
    // STEP 1: CREATE THE EVENT
    await driver.get("http://localhost:5173/create-event");
    await driver.manage().window().setRect({ width: 1292, height: 684 });

    // This part populates the fields with values
    const eventTitle = "Event before edit update";
    await driver.findElement(By.id(":r1:")).click();
    await driver.findElement(By.id(":r1:")).sendKeys(eventTitle); // Event title
    await driver.findElement(By.id(":r3:")).click();
    await driver.findElement(By.id(":r3:")).sendKeys("VVC butterdome"); // Location
    await driver.findElement(By.id(":r5:")).click();
    await driver.findElement(By.id(":r5:")).sendKeys("10/21/2024"); // Start date
    await driver.findElement(By.id(":r7:")).click();
    await driver.findElement(By.id(":r7:")).clear();
    await driver.findElement(By.id(":r7:")).sendKeys("08:30"); // Start time
    
    await driver.findElement(By.id(":r7:")).sendKeys(Key.TAB);
    await driver.findElement(By.id(":r7:")).sendKeys(Key.TAB);
    await driver.findElement(By.id(":r7:")).sendKeys(Key.TAB);
    await driver.findElement(By.id(":r7:")).sendKeys(Key.ARROW_DOWN); // Navigate to AM
    await driver.findElement(By.id(":r7:")).sendKeys(Key.ARROW_DOWN);
    await driver.findElement(By.id(":r7:")).sendKeys(Key.RETURN);

    await driver.findElement(By.id(":r9:")).click();
    await driver.findElement(By.id(":r9:")).sendKeys("10/21/2024"); // End date
    await driver.findElement(By.id(":rb:")).click();
    await driver.findElement(By.id(":rb:")).sendKeys("15:06"); // End time

    await driver.findElement(By.id(":rd:")).click();
    await driver.findElement(By.id(":rd:")).sendKeys("VVC, UofA, Edmonton, AB, CA"); // Address

    // This part clicks the submit button and verifies the alert pop-up
    await driver.findElement(By.css(".MuiButton-containedPrimary")).click();
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    assert.strictEqual(alertText, "Event created successfully!"); // This verifies success of event creation!
    await alert.accept();

    // STEP 2: EDIT THE CREATED EVENT
    await driver.get("http://localhost:5173/calendar");
    await driver.manage().window().setRect({ width: 1292, height: 684 });

    // This part updates the fields
    const eventElement = await driver.findElement(By.xpath(`//div[text()="${eventTitle}"]`)); // This locates the event to be edited.
    await eventElement.click();
    await driver.findElement(By.id(":r1:")).click();
    await clearField(driver, By.id(":r1:"));
    await driver.findElement(By.id(":r1:")).sendKeys("Updated Event Title");

    await driver.findElement(By.id(":r3:")).click();
    await clearField(driver, By.id(":r3:"));
    await driver.findElement(By.id(":r3:")).sendKeys("HUB Mall Coffee Lounge");

    await driver.findElement(By.id(":rd:")).click();
    await clearField(driver, By.id(":rd:"));
    await driver.findElement(By.id(":rd:")).sendKeys("HUB Mall, UofA, Edmonton, AB, CA");

    // This part clicks the submit button and verifies the alert pop-up
    await driver.findElement(By.css(".MuiGrid-grid-xs-6:nth-child(1)")).click();
    await driver.findElement(By.css(".MuiButton-containedPrimary")).click();
    await driver.wait(until.alertIsPresent(), 5000);
    const alertEdit = await driver.switchTo().alert();
    const alertEditText = await alertEdit.getText();
    assert.strictEqual(alertEditText, "Event updated successfully!"); // This verifies success of event edit!
    await alertEdit.accept();
  });
});
