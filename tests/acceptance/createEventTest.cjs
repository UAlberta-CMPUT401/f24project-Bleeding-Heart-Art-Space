/*
Test for US 1.03 - Create and Manage Events
As an Admin, I want to create and manage events so that I can schedule volunteer opportunities.
Acceptance Criteria: Admin can create an event.
                     Admin can specify event details like title, date, time, venue & address.

Generated by Selenium IDE and modified after
*/

const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('createEventTest', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('createEventTest', async function() {
    await driver.get("http://localhost:5173/calendar")
    await driver.manage().window().setRect({ width: 1024, height: 768 });
    await driver.executeScript("document.body.style.zoom='70%';");

    const fabButton = await driver.wait(until.elementIsVisible(driver.findElement(By.css(".MuiFab-root > .MuiSvgIcon-root"))), 10000);
    await driver.wait(until.elementIsEnabled(fabButton), 10000);
    await fabButton.click()

    await driver.wait(until.elementIsVisible(driver.findElement(By.css(".MuiDialog-root"))), 10000);
    const inputField = await driver.findElement(By.id(":r3:"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", inputField);
    await inputField.click();

    // This part populates the fields with values
    await driver.findElement(By.id(":r3:")).sendKeys("Create Event Test")
    await driver.findElement(By.id(":r5:")).click()
    await driver.findElement(By.id(":r5:")).sendKeys("HUB mall")
    await driver.findElement(By.id(":r7:")).click()
    await driver.findElement(By.id(":r7:")).sendKeys("10/29/2024")
    await driver.findElement(By.id(":rb:")).click()
    await driver.findElement(By.id(":rb:")).sendKeys("10/29/2024")
    await driver.findElement(By.id(":r9:")).click()
    await driver.findElement(By.id(":r9:")).clear()
    await driver.findElement(By.id(":r9:")).sendKeys("09:15")
    await driver.findElement(By.id(":r9:")).sendKeys(Key.TAB);
    await driver.findElement(By.id(":r9:")).sendKeys(Key.TAB);
    await driver.findElement(By.id(":r9:")).sendKeys(Key.TAB);
    await driver.findElement(By.id(":r9:")).sendKeys(Key.ARROW_DOWN);
    await driver.findElement(By.id(":r9:")).sendKeys(Key.ARROW_DOWN);
    await driver.findElement(By.id(":r9:")).sendKeys(Key.RETURN);

    await driver.findElement(By.id(":rd:")).click()
    await driver.findElement(By.id(":rd:")).click()
    await driver.findElement(By.id(":rd:")).sendKeys("14:06")

    await driver.findElement(By.id(":rf:")).click()
    {
      const element = await driver.findElement(By.css(".\\_dialogCard_hfpfo_15"))
      await driver.executeScript("arguments[0].scrollIntoView(true);", element);
      await element.click();
    }
    await driver.findElement(By.id(":rf:")).sendKeys("SUB, UofA, Edmonton, AB, CA")

    // This part clicks the submit button and verifies the alert pop-up
    await driver.findElement(By.css(".css-1dj9jbk-MuiButtonBase-root-MuiButton-root")).click();
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    await driver.sleep(2000);
    const alertText = await alert.getText();
    await driver.sleep(2000);
    assert.strictEqual(alertText, "Event created successfully!");
    await driver.sleep(2000);
    await alert.accept();
  })
})
