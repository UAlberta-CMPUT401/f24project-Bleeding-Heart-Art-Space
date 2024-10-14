const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

describe('create-and-delete-event-test', function() {
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

  it('create-and-delete-event-test', async function() {
    // STEP 1: CREATE THE EVENT
    await driver.get("http://localhost:5173/create-event");
    await driver.manage().window().setRect({ width: 1292, height: 684 });
    
    // This part populates the fields with values
    const eventTitle = "Event to be deleted";
    await driver.findElement(By.id(":r1:")).click();
    await driver.findElement(By.id(":r1:")).sendKeys(eventTitle); // Event title
    await driver.findElement(By.id(":r3:")).click();
    await driver.findElement(By.id(":r3:")).sendKeys("VVC butterdome"); // Location
    await driver.findElement(By.id(":r5:")).click();
    await driver.findElement(By.id(":r5:")).sendKeys("10/25/2024"); // Start date
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
    await driver.findElement(By.id(":r9:")).sendKeys("10/25/2024"); // End date
    await driver.findElement(By.id(":rb:")).click();
    await driver.findElement(By.id(":rb:")).sendKeys("15:06"); // End time

    await driver.findElement(By.id(":rd:")).click();
    await driver.findElement(By.id(":rd:")).sendKeys("VVC, UofA, Edmonton, AB, CA"); // Address

    // This part clicks the submit button and verifies the alert pop-up
    await driver.findElement(By.css(".MuiButton-containedPrimary")).click();
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    assert.strictEqual(alertText, "Event created successfully!");
    await alert.accept();

    // STEP 2: DELETE THE CREATED EVENT
    await driver.get("http://localhost:5173/calendar");
    await driver.manage().window().setRect({ width: 1292, height: 684 });

    // Locates event to be deleted
    const eventElement = await driver.findElement(By.xpath(`//div[text()="${eventTitle}"]`));
    await eventElement.click();
    
    // Deletes event and verifies success via an alert pop-up
    await driver.findElement(By.css(".MuiButton-containedSecondary")).click();
    await driver.wait(until.alertIsPresent(), 5000);
    const alertDelete = await driver.switchTo().alert();
    const alertDeleteText = await alertDelete.getText();
    assert.strictEqual(alertDeleteText, "Event deleted successfully!");
    await alertDelete.accept();
  });
});