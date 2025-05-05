# Omnipractice EHR Automation

This application automates client creation and appointment scheduling in the Omnipractice EHR system.

## Screenshots

### 1
![](https://drive.google.com/uc?export=view&id=1f_-zHLOe-AaiZ_P-m4Xz90VG-qzH4gPA)

### 2. Client Creation Form
![](https://drive.google.com/uc?export=view&id=1UN3hXcE8SCQIj4e-6SSoNj7s7CsmLwRy)

### 3. Appointment Scheduling
![](https://drive.google.com/uc?export=view&id=1vkWt8uPdJ_l18AsAIxGxo9K8WuKBQF4T)

---

## Video Demos

### Client Creation
[Watch on Google Drive](https://drive.google.com/file/d/1ddgu0tckZ0VxVhZZ-sRAsyqkiiKHTcAo/view?usp=drive_link)

### Error Handling Demo
[Watch on Google Drive](https://drive.google.com/file/d/1vbeGcT-F7EhryTcVkUtWrtmGKA60I5yL/view?usp=drive_link)

### Appointment Creation
[Watch on Google Drive](https://drive.google.com/file/d/1oWkR871fJZjtWGSXKD4oh4xZ3gke-Ic-/view?usp=drive_link)


## Features

- **Client Creation Automation:** Automatically create Adult, Minor, and Couple client profiles
- **Appointment Creation Automation:** Schedule appointments with existing clients
- **Logging:** Real-time logs of automation process (with error logs)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```
4. Create a `.env` file with your Omnipractice credentials:
   ```
   OMNIPRACTICE_EMAIL=your-email@example.com
   OMNIPRACTICE_PASSWORD=your-password
   PORT=3001
   ```

## Running the Application

Start the development server:

```bash
npm run dev
```

This will start both the frontend (React) and backend (Express) servers.

## API Endpoints

- **POST /api/automate**: Create clients (Adult, Minor, or Couple)
- **POST /api/automate-appointment**: Create appointments
- **GET /api/health**: Health check endpoint

## Client Automation Input Format (JSON)

### Adult Client
```json
{
  clientType: "Adult",
  firstName: "Alice",
  lastName: "Brown",
  email: "alice.brown@example.com",
  phone: "123-456-7890",
  clinician: "Amit Kumar",
  paymentType: "Self pay"
}
```

### Minor Client
```json
{
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
}
```

### Couple Client
```json
{
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
```

## Appointment Automation Input Format (JSON)

```json
{
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
```

## Technologies Used

- **Frontend**: React, React Router
- **Backend**: Express.js, Node.js
- **Automation**: Playwright
- **Other**: TypeScript, dotenv

## Some Points:-

- Pushed the .env file for convenience.
- Implemented bonus feature: automation for appointment creation.
- Added a feature that allows users to load example JSON inputs, making it easier to test and use the automation.
- Added proper error logging for both login and automation errors.