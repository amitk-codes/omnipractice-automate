// Example data for each client type
export const exampleData = {
    adult: {
        clientType: "Adult",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        clinician: "Amit Kumar",
        paymentType: "Self pay"
    },
    minor: {
        clientType: "Minor",
        firstName: "Emma",
        lastName: "Smith",
        email: "",
        phone: "",
        guardianFirstName: "Michael",
        guardianLastName: "Smith",
        guardianEmail: "michael.smith@example.com",
        guardianPhone: "123-456-7891",
        guardianRelationship: "Father",
        clinician: "Amit Kumar",
        paymentType: "Self pay"
    },
    couple: {
        clientType: "Couple",
        firstName: "Robert",
        lastName: "Johnson",
        email: "robert.johnson@example.com",
        phone: "123-456-7892",
        clinician: "Amit Kumar",
        client2FirstName: "Sarah",
        client2LastName: "Johnson",
        client2Email: "sarah.johnson@example.com",
        client2Phone: "123-456-7893",
        client2Clinician: "Amit Kumar",
        responsibleForBilling: "client 1",
        paymentType: "Self pay"
    }
}


// Example data for appointment
export const exampleAppointmentData = {
    clientProfileId: "681143d4d2decf924d435160",
    serviceCode: "IND-60",
    duration: "60",
    location: "Virtual Office",
    date: "06/15/2024",
    time: "10:00 AM",
    memo: "Initial consultation",
    fee: "150",
    isRecurring: true,
    recurringOptions: {
        frequency: "1",
        span: "weeks",
        daysOfWeek: "Mon",
        endAfter: "8"
    }
}