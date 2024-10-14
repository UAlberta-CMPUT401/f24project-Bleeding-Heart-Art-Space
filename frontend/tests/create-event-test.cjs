/*
Test for US 1.03 - Create and Manage Events
As an Admin, I want to create and manage events so that I can schedule volunteer opportunities.
Acceptance Criteria: Admin can create an event.
                     Admin can specify event details like title, date, time, venue & address.
 */

const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('create-event-test', function() {
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
  it('create-event-test', async function() {
    await driver.get("http://localhost:5173/create-event")
    await driver.manage().window().setRect({ width: 1292, height: 684 })

    // This part populates the fields with values
    await driver.findElement(By.id(":r1:")).click()
    await driver.findElement(By.id(":r1:")).sendKeys("Create Event Test")
    await driver.findElement(By.id(":r3:")).click()
    await driver.findElement(By.id(":r3:")).sendKeys("SUB atrium")
    await driver.findElement(By.id(":r5:")).click()
    await driver.findElement(By.id(":r5:")).sendKeys("10/20/2024")
    await driver.findElement(By.id(":r7:")).click()
    await driver.findElement(By.id(":r7:")).clear()
    await driver.findElement(By.id(":r7:")).sendKeys("09:15")

    await driver.findElement(By.id(":r7:")).sendKeys(Key.TAB);
    await driver.findElement(By.id(":r7:")).sendKeys(Key.TAB);
    await driver.findElement(By.id(":r7:")).sendKeys(Key.TAB);
    await driver.findElement(By.id(":r7:")).sendKeys(Key.ARROW_DOWN); // Navigate to the AM
    await driver.findElement(By.id(":r7:")).sendKeys(Key.ARROW_DOWN);
    await driver.findElement(By.id(":r7:")).sendKeys(Key.RETURN);

    await driver.findElement(By.id(":r9:")).click()
    await driver.findElement(By.id(":r9:")).sendKeys("10/20/2024")
    await driver.findElement(By.id(":rb:")).click()
    await driver.findElement(By.id(":rb:")).click()
    await driver.findElement(By.id(":rb:")).sendKeys("14:06")
    await driver.findElement(By.id(":rd:")).click()
    {
      const element = await driver.findElement(By.css(".MuiButton-containedPrimary"))
      await driver.executeScript("arguments[0].scrollIntoView(true);", element);
      await element.click();
    }
    await driver.findElement(By.id(":rd:")).sendKeys("SUB, UofA, Edmonton, AB, CA")

    // This part clicks the submit button and verifies the alert pop-up
    await driver.findElement(By.css(".MuiButton-containedPrimary")).click();
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    assert.strictEqual(alertText, "Event created successfully!"); // This verifies success of event creation!
    await alert.accept();
  })
})