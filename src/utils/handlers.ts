export const checkClientDataHandler = (data: any) => {
  const errors = [];
  
  // First name and last name are required for all client types
  if (!data.firstName || !data.firstName.trim()) {
    errors.push("First name is required");
  }
  
  if (!data.lastName || !data.lastName.trim()) {
    errors.push("Last name is required");
  }
  
  // For Minor clients, guardian relationship is required
  if (data.clientType === "Minor") {
    if (!data.guardianRelationship || !data.guardianRelationship.trim()) {
      errors.push("Guardian relationship is required for Minor clients");
    }
  }
  
  // For Couple clients, responsibleForBilling is required and must be "client 1" or "client 2"
  if (data.clientType === "Couple") {
    if (!data.responsibleForBilling) {
      errors.push("Responsible for billing is required for Couple clients");
    } else if (data.responsibleForBilling !== "client 1" && data.responsibleForBilling !== "client 2") {
      errors.push("Responsible for billing must be 'client 1' or 'client 2'");
    }
  }
  
  return errors;
};


export const checkAppointmentDataHandler = (data: any) => {
  const errors = [];
  
  // Client profile ID is required
  if (!data.clientProfileId || !data.clientProfileId.trim()) {
    errors.push("Client profile ID is required");
  }
  
  // Validate date format (MM/DD/YYYY)
  if (!data.date || !/^\d{2}\/\d{2}\/\d{4}$/.test(data.date)) {
    errors.push("Date is required and must be in MM/DD/YYYY format");
  }
  
  // Validate time format (hh:mm aa)
  if (!data.time || !/^\d{1,2}:\d{2} (AM|PM|am|pm)$/.test(data.time)) {
    errors.push("Time is required and must be in hh:mm AM/PM format");
  }
  
  // Check recurring options if appointment is recurring
  if (data.isRecurring && data.recurringOptions) {
    // Validate frequency is a number if provided
    if (data.recurringOptions.frequency && 
        !/^\d+$/.test(data.recurringOptions.frequency)) {
      errors.push("Frequency must be a number");
    }
    
    // Validate span is either "days" or "weeks"
    if (data.recurringOptions.span) {
      const span = data.recurringOptions.span.toLowerCase();
      if (span !== 'days' && span !== 'weeks') {
        errors.push('Span must be either "days" or "weeks"');
      }
    }
    
    // Validate day of week is one of the valid days
    if (data.recurringOptions.daysOfWeek) {
      const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const day = data.recurringOptions.daysOfWeek;
      if (!validDays.includes(day)) {
        errors.push(`Invalid day of week: ${day}. Must be one of: ${validDays.join(', ')}`);
      }
    }
    
    // Validate end after is a number if provided
    if (data.recurringOptions.endAfter && 
        !/^\d+$/.test(data.recurringOptions.endAfter)) {
      errors.push("End after must be a number");
    }
  }
  
  return errors;
};