export interface ClientData {
    clientType: 'Adult' | 'Minor' | 'Couple';
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    guardianFirstName?: string;
    guardianLastName?: string;
    guardianEmail?: string;
    guardianPhone?: string;
    guardianRelationship?: string;
    client2FirstName?: string;
    client2LastName?: string;
    client2Email?: string;
    client2Phone?: string;
    paymentType: string;
    responsibleForBilling?: 'client 1' | 'client 2';
    clinician?: string;
    client2Clinician?: string;
  }