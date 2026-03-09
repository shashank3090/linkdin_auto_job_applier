
import { Page, ElementHandle } from 'puppeteer';
import { click_gap, smooth_scroll } from '../config/settings';
import { buffer, print_lg, sleep } from './helpers';

// Click Functions
export async function wait_span_click(
  page: Page, 
  text: string, 
  time: number = 5.0, 
  click: boolean = true, 
  scroll: boolean = true, 
  scrollTop: boolean = false
): Promise<ElementHandle | boolean> {
  /**
   * Finds the span element with the given `text`.
   * - Returns `ElementHandle` if found, else `false` if not found.
   * - Clicks on it if `click = true`.
   * - Will spend a max of `time` seconds in searching for each element.
   * - Will scroll to the element if `scroll = true`.
   * - Will scroll to the top if `scrollTop = true`.
   */
  if (!text) return false;
  
  try {
    const xpath = `.//span[normalize-space(.)="${text}"]`;
    const element = await page.waitForXPath(xpath, { timeout: time * 1000 });
    
    if (scroll && element) {
      await scroll_to_view(page, element, scrollTop);
    }
    
    if (click && element) {
      await element.click();
      await buffer(click_gap);
    }
    
    return element || false;
  } catch (e) {
    print_lg(`Click Failed! Didn't find '${text}'`);
    return false;
  }
}

export async function multi_sel(page: Page, texts: string[], time: number = 5.0): Promise<void> {
  /**
   * - For each text in the `texts`, tries to find and click `span` element with that text.
   * - Will spend a max of `time` seconds in searching for each element.
   */
  for (const text of texts) {
    await wait_span_click(page, text, time, false);
    try {
      const xpath = `.//span[normalize-space(.)="${text}"]`;
      const element = await page.waitForXPath(xpath, { timeout: time * 1000 });
      if (element) {
        await scroll_to_view(page, element);
        await element.click();
        await buffer(click_gap);
      }
    } catch (e) {
      print_lg(`Click Failed! Didn't find '${text}'`);
    }
  }
}

export async function multi_sel_noWait(page: Page, texts: string[]): Promise<void> {
  /**
   * - For each text in the `texts`, tries to find and click `span` element with that class.
   * - Won't wait to search for each element, assumes that element is rendered.
   */
  for (const text of texts) {
    try {
      const xpath = `.//span[normalize-space(.)="${text}"]`;
      const [element] = await page.$x(xpath);
      if (element) {
        await scroll_to_view(page, element);
        await element.click();
        await buffer(click_gap);
      } else {
        print_lg(`Click Failed! Didn't find '${text}'`);
      }
    } catch (e) {
      print_lg(`Click Failed! Didn't find '${text}'`);
    }
  }
}

export async function boolean_button_click(page: Page, text: string): Promise<void> {
  /**
   * Tries to click on the boolean button with the given `text` text.
   */
  try {
    const xpath = `.//h3[normalize-space()="${text}"]/ancestor::fieldset//input[@role="switch"]`;
    const [element] = await page.$x(xpath);
    if (element) {
      await scroll_to_view(page, element);
      await element.click();
      await buffer(click_gap);
    }
  } catch (e) {
    print_lg(`Click Failed! Didn't find '${text}'`);
  }
}

// Find functions
export async function find_by_class(page: Page, class_name: string, time: number = 5.0): Promise<ElementHandle> {
  /**
   * Waits for a max of `time` seconds for element to be found, and returns `ElementHandle` if found, else throws if not found.
   */
  return await page.waitForSelector(`.${class_name}`, { timeout: time * 1000 }) as ElementHandle;
}

// Scroll functions
export async function scroll_to_view(page: Page, element: ElementHandle, top: boolean = false, smooth: boolean = smooth_scroll): Promise<void> {
  /**
   * Scrolls the `element` to view.
   * - `smooth` will scroll with smooth behavior.
   * - `top` will scroll to the `element` to top of the view.
   */
  if (top) {
    await page.evaluate((el) => el.scrollIntoView(), element);
    return;
  }
  const behavior = smooth ? "smooth" : "instant";
  await page.evaluate((el, b) => el.scrollIntoView({ block: "center", behavior: b }), element, behavior);
}

// Enter input text functions
export async function text_input_by_ID(page: Page, id: string, value: string, time: number = 5.0): Promise<void> {
  /**
   * Enters `value` into the input field with the given `id` if found, else throws NotFoundException.
   * - `time` is the max time to wait for the element to be found.
   */
  console.log(`text_input_by_ID: ${id} ${value} ${time}`);
    const field = await page.waitForSelector(`#${id}`, { timeout: time * 1000 });
  if (field) {
    await field.click({ clickCount: 3 }); // Select all
    await field.type(value);
  }
}

export async function try_xp(page: Page, xpath: string, click: boolean = true): Promise<ElementHandle | boolean> {
  try {
    const [element] = await page.$x(xpath);
    if (element) {
      if (click) {
        await element.click();
        return true;
      }
      return element;
    }
    return false;
  } catch {
    return false;
  }
}

export async function try_linkText(page: Page, linkText: string): Promise<ElementHandle | boolean> {
  try {
    const [element] = await page.$x(`//a[text()="${linkText}"]`);
    return element || false;
  } catch {
    return false;
  }
}

export async function try_clickButton(page: Page, linkText: string): Promise<ElementHandle | boolean> {
  /**
   * Tries to click a button whose accessible name/text exactly matches `linkText`,
   * similar in spirit to Playwright's:
   *   getByRole('button', { name: 'Sign in', exact: true })
   */
  try {
    print_lg(`Clicking button by text (exact match): ${linkText}`);

    // Escape single quotes in the text so it can be used in XPath
    const name = linkText.replace(/'/g, `"`);

    const xpath = `//*[ (self::button or @role='button' or (self::input and (@type='button' or @type='submit'))) and (normalize-space(text())='${name}' or @aria-label='${name}' or @value='${name}') ]`;

    const [element] = await page.$x(xpath);
    if (element) {
      await element.click();
      await buffer(click_gap);
      return element || false;
    }

    return false;
  } catch (e) {
    print_lg(`try_clickButton failed for "${linkText}"`);
    return false;
  }
}

export async function try_find_by_classes(page: Page, classes: string[]): Promise<ElementHandle> {
  for (const cla of classes) {
    try {
      const element = await page.$(`.${cla}`);
      if (element) return element;
    } catch {
      continue;
    }
  }
  throw new Error("Failed to find an element with given classes");
}

export async function company_search_click(page: Page, companyName: string): Promise<void> {
  /**
   * Tries to search and Add the company to company filters list.
   */
  await wait_span_click(page, "Add a company", 1);
  const search = await page.$x("(.//input[@placeholder='Add a company'])[1]");
  if (search[0]) {
    await search[0].click({ clickCount: 3 }); // Select all
    await search[0].type(companyName);
    await buffer(3);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    print_lg(`Tried searching and adding "${companyName}"`);
  }
}

export async function text_input(page: Page, textInputEle: ElementHandle | boolean, value: string, textFieldName: string = "Text"): Promise<void> {
  if (textInputEle && typeof textInputEle !== 'boolean') {
    await sleep(1000);
    await textInputEle.click({ clickCount: 3 }); // Select all
    await textInputEle.type(value.trim());
    await sleep(2000);
    await page.keyboard.press('Enter');
  } else {
    print_lg(`${textFieldName} input was not given!`);
  }
}
