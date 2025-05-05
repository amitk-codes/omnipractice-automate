import { Page } from "playwright";
import { ClientData } from "../../types/clientTypes";

/**
 * Helper function to handle clinician selection with case-insensitive matching
 * and fallback to first option if no match found
 */
async function handleClinicianSelection(page: Page, desiredClinician: string) {
    // Click to open the clinician dropdown
    await page.click('input[role="combobox"]');

    // Get all dropdown options
    const clinicianOptions = await page.$$('.MuiAutocomplete-option');

    if (clinicianOptions.length === 0) {
        console.log('No clinician options found, using default');
        return;
    }

    let matchFound = false;

    // Get the text of all options and try to find a case-insensitive match
    for (const option of clinicianOptions) {
        const optionText = await option.textContent();
        if (optionText && optionText.trim().toLowerCase() === desiredClinician.toLowerCase()) {
            await option.click();
            matchFound = true;
            console.log(`Selected clinician: ${optionText.trim()}`);
            break;
        }
    }

    // If no match found, select the first option
    if (!matchFound) {
        const firstOptionText = await clinicianOptions[0].textContent();
        await clinicianOptions[0].click();
        console.log(`Desired clinician "${desiredClinician}" not found. Selected first option: ${firstOptionText?.trim()}`);
    }
}


/**
 * Helper function to handle payment type selection with case-insensitive matching
 * and fallback to first option if no match found
 */
async function handlePaymentTypeSelection(page: any, desiredPaymentType: string) {
    // Click to open the payment type dropdown
    await page.click('div[id="mui-component-select-paymentType"]');

    // Get all payment type options
    const paymentOptions = await page.$$('.MuiMenuItem-root');

    if (paymentOptions.length === 0) {
        console.log('No payment options found, using default');
        return;
    }

    let matchFound = false;

    // Get the text of all options and try to find a case-insensitive match
    for (const option of paymentOptions) {
        const optionText = await option.textContent();
        if (optionText && optionText.trim().toLowerCase() === desiredPaymentType.toLowerCase()) {
            await option.click();
            matchFound = true;
            console.log(`Selected payment type: ${optionText.trim()}`);
            break;
        }
    }

    // If no match found, select the first option
    if (!matchFound) {
        const firstOptionText = await paymentOptions[0].textContent();
        await paymentOptions[0].click();
        console.log(`Desired payment type "${desiredPaymentType}" not found. Selected first option: ${firstOptionText?.trim()}`);
    }
}



/**
 * Fill out the form for an Adult client
 */
export async function fillAdultClientForm(page: any, clientData: ClientData) {
    // Fill first name and last name
    await page.fill('input[name="firstName"]', clientData.firstName);
    await page.fill('input[name="lastName"]', clientData.lastName);

    // Fill email and phone if provided
    if (clientData.email) {
        await page.fill('input[name="email"]', clientData.email);
    }

    if (clientData.phone) {
        await page.fill('input[name="phoneNumber"]', clientData.phone);
    }

    // Handle clinician selection if provided
    if (clientData.clinician) {
        await handleClinicianSelection(page, clientData.clinician);
    }

    // Handle payment type selection
    await handlePaymentTypeSelection(page, clientData.paymentType);

    // Click the Continue button
    const buttons = await page.$$('button');
    await buttons[buttons.length - 1].click();

    console.log('Filled Adult client form');
}

/**
 * Fill out the form for a Minor client
 */
export async function fillMinorClientForm(page: any, clientData: ClientData) {
    // Fill client information first
    await page.fill('input[name="firstName"]', clientData.firstName);
    await page.fill('input[name="lastName"]', clientData.lastName);

    if (clientData.email) {
        await page.fill('input[name="email"]', clientData.email);
    }

    if (clientData.phone) {
        await page.fill('input[name="phoneNumber"]', clientData.phone);
    }

    // Handle clinician selection for minor
    if (clientData.clinician) {
        await handleClinicianSelection(page, clientData.clinician);
    }

    // Click on Guardian tab
    await page.getByText('Guardian').click();

    // Fill guardian information
    if (clientData.guardianFirstName) {
        await page.fill('input[name="firstName"]', clientData.guardianFirstName);
    }

    if (clientData.guardianLastName) {
        await page.fill('input[name="lastName"]', clientData.guardianLastName);
    }

    if (clientData.guardianEmail) {
        await page.fill('input[name="email"]', clientData.guardianEmail);
    }

    if (clientData.guardianPhone) {
        await page.fill('input[name="phoneNumber"]', clientData.guardianPhone);
    }

    if (clientData.guardianRelationship) {
        await page.fill('input[name="guardianRelationshipToClient"]', clientData.guardianRelationship);
    }

    // Handle payment type selection
    await handlePaymentTypeSelection(page, clientData.paymentType);

    // Click the Next button
    const buttons = await page.$$('button');
    await buttons[buttons.length - 1].click();

    console.log('Filled Minor client form');
}


/**
 * Fill out the form for a Couple client
 */
export async function fillCoupleClientForm(page: any, clientData: ClientData) {
    // Client 1 information
    await page.fill('input[name="firstName"]', clientData.firstName);
    await page.fill('input[name="lastName"]', clientData.lastName);

    if (clientData.email) {
        await page.fill('input[name="email"]', clientData.email);
    }

    if (clientData.phone) {
        await page.fill('input[name="phoneNumber"]', clientData.phone);
    }

    // Handle clinician selection for Client 1
    if (clientData.clinician) {
        await handleClinicianSelection(page, clientData.clinician);
    }

    // Check if Client 1 is responsible for billing
    if (clientData.responsibleForBilling === 'client 1') {
        // Check the billing option checkbox if it's not already checked
        const isChecked = await page.isChecked('input[name="billingOption"]');
        if (!isChecked) {
            await page.click('input[name="billingOption"]');
        }

        // Handle payment type selection for Client 1
        await handlePaymentTypeSelection(page, clientData.paymentType);
    }

    // Click on Client 2 tab
    await page.getByText('Client 2').click();

    // Fill Client 2 information if provided
    if (clientData.client2FirstName) {
        await page.fill('input[name="firstName"]', clientData.client2FirstName);
    }

    if (clientData.client2LastName) {
        await page.fill('input[name="lastName"]', clientData.client2LastName);
    }

    if (clientData.client2Email) {
        await page.fill('input[name="email"]', clientData.client2Email);
    }

    if (clientData.client2Phone) {
        await page.fill('input[name="phoneNumber"]', clientData.client2Phone);
    }

    // Handle clinician selection for Client 2
    if (clientData.client2Clinician) {
        await handleClinicianSelection(page, clientData.client2Clinician);
    }

    // Check if Client 2 is responsible for billing
    if (clientData.responsibleForBilling === 'client 2') {
        // Check the billing option checkbox if it's not already checked
        const isChecked = await page.isChecked('input[name="billingOption"]');
        if (!isChecked) {
            await page.click('input[name="billingOption"]');
        }

        // Handle payment type selection for Client 2
        await handlePaymentTypeSelection(page, clientData.paymentType);
    }

    // Click the Next button
    const buttons = await page.$$('button');
    await buttons[buttons.length - 1].click();

    console.log('Filled Couple client form');
}