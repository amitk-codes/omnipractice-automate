import { chromium } from "playwright";
import { AppointmentData } from "../../types/appointmentTypes";
import { validateAppointmentData } from "../../validation/appointmentValidation";
import { EMAIL, PASSWORD } from "../../utils/constants";
import { checkForErrorMessages } from "../../utils/browserUtils";
import { fillAppointmentForm } from "./formFilling";

/**
 * Automates the process of creating an appointment in Omnipractice
 */
export async function automateAppointmentCreation(appointmentData: AppointmentData) {
  // Validate the appointment data
  const validationErrors = validateAppointmentData(appointmentData);
  if (validationErrors.length > 0) {
    return {
      success: false,
      message: `Validation error: ${validationErrors.join(", ")}`
    };
  }

  // Browser setup
  let browser;
  try {
    browser = await chromium.launch({
      headless: false,
    });
  } catch (error) {
    console.error('Failed to launch browser:', error);
    return {
      success: false,
      message: 'Failed to launch browser. Please make sure Playwright is properly installed.'
    };
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Starting appointment automation process...');

    // Navigate to login page
    try {
      await page.goto('https://ehr.omnipractice.ai/auth', { timeout: 60000 });
      console.log('Navigated to login page');
    } catch (error) {
      throw new Error('Failed to load the login page. Please check your internet connection.');
    }

    // Login process
    try {
      await page.fill('input[type="email"]', EMAIL);
      await page.fill('input[type="password"]', PASSWORD);
      await page.click('button:has-text("Login")');
      console.log('Login credentials entered');

      // Check for login errors with the helper function
      const loginError = await checkForErrorMessages(page, 'Login');
      if (loginError) {
        throw new Error(`Login failed: ${loginError}`);
      }

      try {
        await page.waitForURL('https://ehr.omnipractice.ai/appointments', { timeout: 30000 });
        console.log('Logged in successfully');
      } catch (urlError) {
        // Check for error message on the login page
        const errorVisible = await page.isVisible('text="Invalid email or password"');
        if (errorVisible) {
          throw new Error('Login failed: Invalid email or password');
        }

        // One more check for any error messages
        const lateLoginError = await checkForErrorMessages(page, 'Late login');
        if (lateLoginError) {
          throw new Error(`Login failed: ${lateLoginError}`);
        }

        throw new Error('Login failed: Timed out waiting for redirect after login');
      }
    } catch (error) {
      throw new Error(`Login process failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Click on "Create" button to open dropdown
    await page.click('button:has-text("Create")');
    console.log('Clicked Create button');

    // Click on "Create Appointment" option
    await page.getByText('Create Appointment').click();
    console.log('Opened Create Appointment form');

    // Fill out the appointment form
    await fillAppointmentForm(page, appointmentData);

    console.log('Clicking final Create Appointment button');
    const buttons = await page.$$('button');
    await buttons[buttons.length - 1].click();

    // Multiple checks for appointment creation errors
    let checkCount = 0;
    const maxChecks = 3;
    let appointmentCreationError = null;

    while (checkCount < maxChecks) {
      checkCount++;
      console.log(`Checking for appointment creation errors (attempt ${checkCount}/${maxChecks})...`);

      // Wait for network activity and check for errors
      try {
        await page.waitForLoadState('networkidle', { timeout: 20000 });
        console.log('Network activity completed');
      } catch (networkError) {
        console.warn('Timeout waiting for network idle, continuing with error checks');
      }

      // Check for error messages
      appointmentCreationError = await checkForErrorMessages(page, `Appointment creation (check ${checkCount})`);
      if (appointmentCreationError) {
        console.error(`Appointment creation error found on check ${checkCount}: ${appointmentCreationError}`);
        break;
      }

      // Wait before checking again
      if (checkCount < maxChecks) {
        await page.waitForTimeout(2000);
      }
    }

    if (appointmentCreationError) {
      throw new Error(`Appointment creation failed: ${appointmentCreationError}`);
    }

    // Wait additional time to ensure everything is processed
    await page.waitForTimeout(3000);
    console.log('Appointment created successfully');

    return { success: true, message: 'Appointment created successfully' };
  } catch (error) {
    console.error('Error during automation:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  } finally {
    try {
      await browser.close();
      console.log('Browser closed successfully');
    } catch (error) {
      console.error('Error closing browser:', error);
    }
  }
}