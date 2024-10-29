/*
Test for Volunteer Roles Feature
- This script tests the deletion of volunteer roles that are assigned to specific shifts.

Generated by Selenium IDE and modified after
*/

const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

describe('deleteRoleTest', function() {
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

  it('deleteRoleTest', async function() {

    // STEP 1 - CREATE A ROLE
    await driver.get("http://localhost:5173/volunteer-management")
    await driver.manage().window().setRect({ width: 1024, height: 768 });
    await driver.executeScript("document.body.style.zoom='70%';");
    
    await driver.findElement(By.css(".css-2mkfr1-MuiButtonBase-root-MuiButton-root")).click()
    await driver.sleep(3000);
    await driver.findElement(By.id(":r5:")).click()
    {
      const element = await driver.findElement(By.css(".css-i5v8s4-MuiInputBase-input-MuiOutlinedInput-input"))
      await driver.executeScript("arguments[0].scrollIntoView(true);", element);
      await element.click();
      await driver.sleep(1000);
      await element.sendKeys("Delete this role")
    }
    await driver.sleep(1000);
    await driver.findElement(By.css(".MuiButton-textPrimary")).click()
    await driver.sleep(1000);
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    assert.strictEqual(alertText, "Volunteer role created successfully!");
    await driver.sleep(1000);
    await alert.accept();
    await driver.sleep(1000);
    await driver.navigate().refresh();

    // STEP 2 - DELETE THAT ROLE
    const dropdown = await driver.findElement(By.css(".MuiSelect-select"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", dropdown);
    await dropdown.click();
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.css('.MuiList-root .MuiMenuItem-root')), 5000);
    const deleteRoleOption = await driver.findElement(By.xpath("//li[contains(text(), 'Delete this role')]"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", deleteRoleOption);
    await driver.sleep(1000);
    await deleteRoleOption.click();
    await driver.sleep(1000);
    {
        const element = await driver.findElement(By.css(".MuiButton-containedSecondary"))
        await driver.executeScript("arguments[0].scrollIntoView(true);", element);
        await element.click();
        await driver.sleep(1000);
    }
    const alert2 = await driver.switchTo().alert();
    await driver.sleep(1000);
    const alertText2 = await alert2.getText();
    assert.strictEqual(alertText2, "Are you sure you want to delete this role?");
    await driver.sleep(1000);
    await alert2.accept();
    await driver.sleep(1000);
    const alert3 = await driver.switchTo().alert();
    await driver.sleep(1000);
    const alertText3 = await alert3.getText();
    await driver.sleep(1000);
    assert.strictEqual(alertText3, "Volunteer role deleted successfully!");
    await alert3.accept();
  });
});
