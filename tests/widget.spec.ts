import { test, expect } from '@playwright/test';
import {WidgetPage} from "./widget.page";

test.describe('Uchi.ru widget ', () => {
  let widgetPage: WidgetPage;

  test.beforeEach(async ({page, context}) => {
    widgetPage = new WidgetPage(page);

    // pin the main page A/B variant that has the widget
    await context.addCookies([{name: 'ab_mainpage_redesign', value: 'a', url: 'https://uchi.ru'}]);

    // close cookies popup whenever it appears
    await page.addLocatorHandler(page.locator('._UCHI_COOKIE__button:visible'), async (button) => {
      await button.click();
    });

    // open uchi.ru main page
    await page.goto('/');
  });

  test('opens', async () => {
    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible()
  });

  test('has correct title', async () => {
    await widgetPage.openWidget();

    await widgetPage.getPopularArticles().first().click();

    await widgetPage.clickWriteToUs();

    await expect(widgetPage.getTitle()).toHaveText('Связь с поддержкой');
  });

  test('closes', async () => {
    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible();

    await widgetPage.closeWidget();

    await expect(widgetPage.getWidgetBody()).toBeHidden();
  });
});
