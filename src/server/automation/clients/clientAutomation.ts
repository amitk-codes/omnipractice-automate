import { chromium } from 'playwright';
import { ClientData } from '../../types/clientTypes';
import { EMAIL, PASSWORD } from '../../utils/constants';
import { validateClientData } from '../../validation/clientValidation';
import { checkForErrorMessages } from '../../utils/browserUtils';
import { fillAdultClientForm, fillCoupleClientForm, fillMinorClientForm } from './formFilling';

/**
 * Automates the process of creating a client in Omnipractice
 */
export async function automateClientCreation(clientData: ClientData) {
    // Validate the client data
    const validationErrors = validateClientData(clientData);
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
      console.log('Starting automation process...');
      
      // Navigate to login page
      try {
        await page.goto('https://ehr.omnipractice.ai/auth', {timeout: 60000});
        console.log('Navigated to login page');
      } catch (error) {
        throw new Error('Failed to load the login page. Please check your internet connection.');
      }
      
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
        
        // Wait for dashboard to load or error page
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
      
      // Click on Create button
      await page.click('button:has-text("Create")');
      console.log('Clicked Create button');
      
      // Click on Create Client option
      await page.getByText('Create Client').click();
      console.log('Opened Create Client form');
      
      // Select client type (Adult, Minor, or Couple)
      await page.click(`input[name="${clientData.clientType}"]`);
      console.log(`Selected client type: ${clientData.clientType}`);
      
      // Fill out client information based on client type
      if (clientData.clientType === 'Adult') {
        await fillAdultClientForm(page, clientData);
      } else if (clientData.clientType === 'Minor') {
        await fillMinorClientForm(page, clientData);
      } else if (clientData.clientType === 'Couple') {
        await fillCoupleClientForm(page, clientData);
      }
      
      // Final step: Click the "Create Client" button
      console.log('Clicking Final Create Client button');
      await page.click('button:has-text("Create Client")');
  
      // Implement multiple checks for client creation errors
      let checkCount = 0;
      const maxChecks = 3;
      let clientCreationError = null;
  
      while (checkCount < maxChecks) {
        checkCount++;
        console.log(`Checking for client creation errors (attempt ${checkCount}/${maxChecks})...`);
        
        try {
          // Wait for network idle with a reasonable timeout
          await page.waitForLoadState('networkidle', { timeout: 20000 });
          console.log('Network activity completed');
        } catch (networkError) {
          console.warn('Timeout waiting for network idle, continuing with error checks');
        }
        
        // Check for error messages
        clientCreationError = await checkForErrorMessages(page, `Client creation (check ${checkCount})`);
        if (clientCreationError) {
          console.error(`Client creation error found on check ${checkCount}: ${clientCreationError}`);
          break;
        }
        
        // Wait before checking again
        if (checkCount < maxChecks) {
          await page.waitForTimeout(2000);
        }
      }
  
      if (clientCreationError) {
        throw new Error(`Client creation failed: ${clientCreationError}`);
      }
  
      // Wait additional time to ensure everything is processed
      await page.waitForTimeout(3000);
      console.log('Client creation completed successfully');
      
      return { success: true, message: 'Client created successfully' };
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