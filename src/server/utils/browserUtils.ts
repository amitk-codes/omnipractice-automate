import { Page } from "playwright";

/**
 * Helper function to check for error messages with multiple selectors
 */
export async function checkForErrorMessages(page: Page, context: string): Promise<string | null> {
    try {
      // Wait a bit longer to ensure any error messages have time to appear
      await page.waitForTimeout(2000);
      
      // Try multiple selectors that could contain error messages
      const errorSelectors = [
        '.MuiAlert-filledError',
        '.MuiAlert-standardError',
        '.MuiSnackbar-root .MuiAlert-root',
        '[role="alert"]',
        'text="error"',
        'text="failed"',
        'text="invalid"'
      ];
      
      for (const selector of errorSelectors) {
        const errorElement = await page.$(selector);
        if (errorElement) {
          const isVisible = await errorElement.isVisible();
          if (isVisible) {
            const errorText = await errorElement.textContent();
            if (errorText && errorText.trim()) {
              console.error(`${context} error detected with selector "${selector}": ${errorText.trim()}`);
              return errorText.trim();
            }
          }
        }
      }
      
      return null;
    } catch (error) {
      console.warn(`Error while checking for error messages: ${error}`);
      return null;
    }
  }