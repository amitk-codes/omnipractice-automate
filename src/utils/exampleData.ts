// Example data for each client type
export const exampleData = {
    adult: {
        clientType: "Adult",
        firstName: "Alice",
        lastName: "Brown",
        email: "alice.brown@example.com",
        phone: "123-456-7890",
        clinician: "Amit Kumar",
        paymentType: "Self pay"
    },
    minor: {
        clientType: "Minor",
        firstName: "Liam",
        lastName: "Wilson",
        email: "liam.wilson@example.com",
        phone: "123-456-7891",
        guardianFirstName: "Olivia",
        guardianLastName: "Wilson",
        guardianEmail: "olivia.wilson@example.com",
        guardianPhone: "123-456-7892",
        guardianRelationship: "Mother",
        clinician: "Amit Kumar",
        paymentType: "Self pay"
    },
    couple: {
        clientType: "Couple",
        firstName: "David",
        lastName: "Lee",
        email: "david.lee@example.com",
        phone: "123-456-7893",
        clinician: "Amit Kumar",
        client2FirstName: "Sophia",
        client2LastName: "Lee",
        client2Email: "sophia.lee@example.com",
        client2Phone: "123-456-7894",
        client2Clinician: "Amit Kumar",
        responsibleForBilling: "client 1",
        paymentType: "Self pay"
    }
}


// Example data for appointment
export const exampleAppointmentData = {
    clientProfileId: "6818fc47597665f94ea2eb95",
    service: "90834, Psychotherapy, 45 mins...",
    duration: "60",
    location: "Telehealth : Online video",
    date: "08/02/2025",
    time: "10:30 AM",
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