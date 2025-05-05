import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { isValidEmail } from './validation/emailValidation';
import { EMAIL, PASSWORD } from './utils/constants';
import { automateClientCreation } from './automation/clients/clientAutomation';
import { automateAppointmentCreation } from './automation/appointments/appointmentAutomation';

// Loading environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({
  limit: '1mb',
}));

// Error handling for JSON parsing errors
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid JSON format in request body'
    });
  }
  next();
});

// Client creation automation endpoint
app.post('/api/automate', async (req, res) => {
  try {
    // Validate credentials before proceeding
    if (!isValidEmail(EMAIL)) {
      return res.status(400).json({
        success: false,
        message: 'Validation error: Invalid email format in environment configuration'
      });
    }

    if (PASSWORD.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Validation error: Password must be at least 8 characters'
      });
    }

    const clientData = req.body;
    console.log('Received client data:', clientData);
    
    if (!clientData || Object.keys(clientData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Request body is empty or invalid'
      });
    }
    
    // Check if clientType is provided and valid
    if (!clientData.clientType || !['Adult', 'Minor', 'Couple'].includes(clientData.clientType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or missing clientType. Must be Adult, Minor, or Couple.'
      });
    }
    
    // Run the automation
    const result = await automateClientCreation(clientData);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      const statusCode = result.message.includes('Validation error') ? 400 : 500;
      return res.status(statusCode).json(result);
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown server error' 
    });
  }
});

// Appointment creation automation endpoint
app.post('/api/automate-appointment', async (req, res) => {
  try {
    // Validate credentials before proceeding
    if (!isValidEmail(EMAIL)) {
      return res.status(400).json({
        success: false,
        message: 'Validation error: Invalid email format in environment configuration'
      });
    }

    if (PASSWORD.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Validation error: Password must be at least 8 characters'
      });
    }

    const appointmentData = req.body;
    console.log('Received appointment data:', appointmentData);
    
    if (!appointmentData || Object.keys(appointmentData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Request body is empty or invalid'
      });
    }
    
    // Run the automation
    const result = await automateAppointmentCreation(appointmentData);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      const statusCode = result.message.includes('Validation error') ? 400 : 500;
      return res.status(statusCode).json(result);
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown server error' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Handling 404 errors
app.use((_req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 