/**
 * Interface for appointment data
 */
export interface AppointmentData {
    clientProfileId: string;
    service?: string;
    duration?: string;
    location?: string;
    date: string;
    time: string;
    memo?: string;
    fee?: string;
    isRecurring?: boolean;
    recurringOptions?: {
        frequency?: string;
        span?: string;
        daysOfWeek?: string;
        endAfter?: string;
    }
}