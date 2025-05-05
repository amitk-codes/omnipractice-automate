import { AppointmentData } from "../types/appointmentTypes";

/**
 * Validates appointment data
 */
export function validateAppointmentData(appointmentData: AppointmentData) {
  const errors = [];

  // Client profile ID is required
  if (!appointmentData.clientProfileId || !appointmentData.clientProfileId.trim()) {
    errors.push("Client profile ID is required");
  }

  // Validate date format (MM/DD/YYYY)
  if (!appointmentData.date || !/^\d{2}\/\d{2}\/\d{4}$/.test(appointmentData.date)) {
    errors.push("Date is required and must be in MM/DD/YYYY format");
  }

  // Validate time format (hh:mm aa)
  if (!appointmentData.time || !/^\d{1,2}:\d{2} (AM|PM|am|pm)$/.test(appointmentData.time)) {
    errors.push("Time is required and must be in hh:mm AM/PM format");
  }

  // Check recurring options if appointment is recurring
  if (appointmentData.isRecurring && appointmentData.recurringOptions) {
    // Validate frequency is a number if provided
    if (appointmentData.recurringOptions.frequency &&
      !/^\d+$/.test(appointmentData.recurringOptions.frequency)) {
      errors.push("Frequency must be a number");
    }

    // Validate span is either "days" or "weeks"
    if (appointmentData.recurringOptions.span) {
      const span = String(appointmentData.recurringOptions.span).toLowerCase();
      if (span !== 'days' && span !== 'weeks') {
        errors.push('Span must be either "days" or "weeks"');
      }
    }

    // Validate day of week is one of the valid days
    if (appointmentData.recurringOptions.daysOfWeek) {
      const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const day = appointmentData.recurringOptions.daysOfWeek;
      if (!validDays.includes(day)) {
        errors.push(`Invalid day of week: ${day}. Must be one of: ${validDays.join(', ')}`);
      }
    }

    // Validate 'end after' is a number if provided
    if (appointmentData.recurringOptions.endAfter &&
      !/^\d+$/.test(appointmentData.recurringOptions.endAfter)) {
      errors.push("End after must be a number");
    }
  }

  return errors;
}