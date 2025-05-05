import { Page } from "playwright";

/**
 * Helper function to select a client profile by ID
 */
export async function selectClientProfileById(page: Page, clientProfileId: string) {
    try {
        // Find the client profile dropdown field
        const label = await page.locator('label:has-text("Select client profile*")').first();

        if (!label) {
            throw new Error('Client profile field not found');
        }

        // Get the parent div
        const parentDiv = await label.locator('xpath=./..').first();

        // Find the input within the parent div
        const input = await parentDiv.locator('input').first();

        // Setup listener for the API response
        let apiResponseReceived = false;
        let targetIndex = -1;

        // Listen for API responses to intercept the client profiles data
        page.on('response', async response => {
            const url = response.url();
            if (url.includes('api/practice/allClientProfiles') && response.status() === 200) {
                try {
                    const responseData = await response.json();
                    if (responseData.data && Array.isArray(responseData.data)) {
                        console.log(`Found client profiles API response with ${responseData.data.length} profiles`);

                        targetIndex = responseData.data.findIndex((profile: any) =>
                            profile.clientProfileId === clientProfileId
                        );

                        apiResponseReceived = true;

                        if (targetIndex === -1) {
                            console.warn(`Client profile with ID ${clientProfileId} not found in API response`);
                        } else {
                            console.log(`Found client profile with ID ${clientProfileId} at index ${targetIndex}`);
                        }
                    }
                } catch (error) {
                    console.error('Error parsing API response:', error);
                }
            }
        });

        // Click to open the dropdown - this will trigger the API call
        await input.click();
        console.log('Clicked client profile dropdown');

        // Wait for dropdown options to appear
        await page.waitForSelector('.MuiAutocomplete-listbox li', { timeout: 5000 });
        console.log('Dropdown options appeared');

        if (!apiResponseReceived) {
            await page.waitForTimeout(1000);
        }

        const options = await page.$$('.MuiAutocomplete-option');
        console.log(`Found ${options.length} dropdown options`);

        if (options.length === 0) {
            throw new Error('No client profile options found in dropdown');
        }

        // If we found the index from the API response, select that option
        if (targetIndex !== -1 && targetIndex < options.length) {
            await options[targetIndex].click();
            console.log(`Selected client profile by ID ${clientProfileId} at index ${targetIndex}`);
        } else {
            // If we didn't find the exact profile or index is out of bounds, throw error
            throw new Error(`Client profile with ID ${clientProfileId} not found or couldn't be selected`);
        }

        // Wait for the selection to register
        await page.waitForTimeout(500);
    } catch (error) {
        console.error(`Error selecting client profile by ID: ${error}`);
        throw error;
    }
}

/**
 * Helper function to select an option from a dropdown by label
 */
export async function selectDropdownByLabel(page: Page, labelText: string, value: string) {
    try {
        // Find the label with the specified text
        const label = await page.locator(`label:has-text("${labelText}")`).first();

        if (!label) {
            console.warn(`Label "${labelText}" not found`);
            return;
        }

        // Get the parent div
        const parentDiv = await label.locator('xpath=./..').first();

        // Find the input within the parent div
        const input = await parentDiv.locator('input').first();

        if (labelText.includes('Duration')) {
            const durationValue = String(value).replace(/\s*min\s*$/i, '');
            await input.fill(durationValue);
            console.log(`Directly filled ${labelText} input with: ${durationValue}`);
            return;
        }

        // Click to focus the input and open the dropdown
        await input.click();

        // Type the value to search for it
        await input.fill(value);

        // Wait a moment for options to appear
        await page.waitForTimeout(1000);

        // Check if there are any options
        const hasOptions = await page.isVisible('.MuiAutocomplete-listbox li');

        if (!hasOptions) {
            console.warn(`No dropdown options found for "${labelText}" with value "${value}"`);
            throw new Error(`No matching options found for ${labelText}: ${value}`);
        }

        // Click the first option in the dropdown
        await page.click('.MuiAutocomplete-option:first-child');

        // Wait a moment for the selection to register
        await page.waitForTimeout(500);

        console.log(`Selected option for ${labelText}: ${value}`);
    } catch (error) {
        console.error(`Error in selectDropdownByLabel for "${labelText}": ${error}`);
        throw error;
    }
}