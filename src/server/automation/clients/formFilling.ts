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