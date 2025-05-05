import { Page } from "playwright";
import { AppointmentData } from "../../types/appointmentTypes";
import { selectClientProfileById, selectDropdownByLabel } from "./selectors";

/**
 * Fills out the appointment form
 */
export async function fillAppointmentForm(page: Page, appointmentData: AppointmentData) {
    // Select client profile by ID (required field)
    await selectClientProfileById(page, appointmentData.clientProfileId);

    // Select service
    if (appointmentData.service) {
        const serviceValue = appointmentData.service || '';
        await selectDropdownByLabel(page, 'Select service *', serviceValue);
        console.log(`Selected service: ${serviceValue}`);
    }

    // Select duration
    if (appointmentData.duration) {
        await selectDropdownByLabel(page, 'Duration *', appointmentData.duration);
        console.log(`Handled duration: ${appointmentData.duration}`);
    }

    // Select location
    if (appointmentData.location) {
        await selectDropdownByLabel(page, 'Select location *', appointmentData.location);
        console.log(`Selected location: ${appointmentData.location}`);
    }

    // Fill date field
    await page.fill('input[placeholder="MM/DD/YYYY"]', appointmentData.date);
    console.log(`Entered date: ${appointmentData.date}`);

    // Fill time field
    await page.fill('input[placeholder="hh:mm aa"]', appointmentData.time);
    console.log(`Entered time: ${appointmentData.time}`);

    // Fill memo
    if (appointmentData.memo) {
        await page.fill('textarea[name="memo"]', appointmentData.memo);
        console.log(`Entered memo: ${appointmentData.memo}`);
    }

    // Fill fee
    if (appointmentData.fee) {
        await page.fill('input[name="fee"]', appointmentData.fee);
        console.log(`Entered fee: ${appointmentData.fee}`);
    }

    // Handle recurring options
    if (appointmentData.isRecurring) {
        // Try multiple approaches to click the recurring checkbox
        try {
            // Approach 1: Try clicking the label text directly
            await page.click('text="Recurring Appointment"', { force: true });
            console.log('Clicked recurring checkbox using text approach');
        } catch (error) {
            try {
                // Approach 2: Try clicking the input with force option
                await page.click('input[name="Recurrence"]', { force: true });
                console.log('Clicked recurring checkbox using input selector with force');
            } catch (error) {
                try {
                    // Approach 3: Try clicking the parent label
                    await page.click('label:has-text("Recurring Appointment")', { force: true });
                    console.log('Clicked recurring checkbox using label approach');
                } catch (error) {
                    console.warn('Failed to click recurring checkbox using standard methods, trying JavaScript click');
                    // Approach 4: Use JavaScript to click the checkbox
                    await page.evaluate(() => {
                        const checkbox = document.querySelector('input[name="Recurrence"]') as HTMLInputElement;
                        if (checkbox) {
                            checkbox.click();
                            return true;
                        }
                        return false;
                    });
                    console.log('Attempted JavaScript click on recurring checkbox');
                }
            }
        }

        // Wait for the recurring options to appear
        await page.waitForTimeout(1000);
        console.log('Enabled recurring options');

        const recurringOptions = appointmentData.recurringOptions;
        if (recurringOptions) {
            // Fill frequency if provided
            if (recurringOptions.frequency) {
                await page.fill('input[name="frequency"]', recurringOptions.frequency);
                console.log(`Set frequency to: ${recurringOptions.frequency}`);
            }

            // Select span if provided (days or weeks only)
            if (recurringOptions.span) {
                try {
                    await page.click('div[id="mui-component-select-span"]');
                    console.log('Clicked span dropdown');

                    // Wait for the dropdown to open
                    await page.waitForTimeout(500);

                    const spanValue = String(recurringOptions.span).toLowerCase();

                    if (spanValue === 'days' || spanValue === 'weeks') {
                        await page.click(`li[data-value="${spanValue}"]`);
                        console.log(`Selected span: ${spanValue}`);
                    } else {
                        console.warn(`Invalid span value: ${spanValue}. Defaulting to 'days'`);
                        await page.click('li[data-value="days"]');
                    }
                } catch (error) {
                    console.warn(`Error selecting span: ${error}. Will try to continue.`);
                }
            }

            // Select a day of the week if provided
            if (recurringOptions.daysOfWeek) {
                const dayOfWeekLabelVisible = await page.isVisible('label:has-text("Select a Day of the Week")');

                if (dayOfWeekLabelVisible) {
                    try {
                        await page.click(`text="${recurringOptions.daysOfWeek}"`, { force: true });
                        console.log(`Selected day of week: ${recurringOptions.daysOfWeek}`);
                    } catch (error) {
                        console.warn(`Error selecting day of week: ${error}. Will try to continue.`);
                    }
                } else {
                    console.log('Day of week selection not available - "Select a Day of the Week" label not found');
                }
            }

            // Fill end after if provided
            if (recurringOptions.endAfter) {
                await page.fill('input[name="endAfterAppointments"]', recurringOptions.endAfter);
                console.log(`Set end after to: ${recurringOptions.endAfter}`);
            }
        }
    }

    console.log('Appointment form filled successfully');
}