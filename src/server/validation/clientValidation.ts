import { ClientData } from "../types/clientTypes";

/**
 * Validate client data before automation
 */
export function validateClientData(clientData: ClientData) {
  const errors = [];

  // First name and last name are required for all client types
  if (!clientData.firstName || !clientData.firstName.trim()) {
    errors.push("First name is required");
  }

  if (!clientData.lastName || !clientData.lastName.trim()) {
    errors.push("Last name is required");
  }

  // For Minor clients, guardian relationship is required
  if (clientData.clientType === "Minor") {
    if (!clientData.guardianRelationship || !clientData.guardianRelationship.trim()) {
      errors.push("Guardian relationship is required for Minor clients");
    }
  }

  // For Couple clients, responsibleForBilling is required and must be "client 1" or "client 2"
  if (clientData.clientType === "Couple") {
    if (!clientData.responsibleForBilling) {
      errors.push("Responsible for billing is required for Couple clients");
    } else if (clientData.responsibleForBilling !== "client 1" && clientData.responsibleForBilling !== "client 2") {
      errors.push("Responsible for billing must be 'client 1' or 'client 2'");
    }
  }

  return errors;
}