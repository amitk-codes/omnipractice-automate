import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Loading environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({
  limit: '1mb',
}));

// Error handling for JSON parsing errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid JSON format in request body'
    });
  }
  next();
});


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Handling 404 errors
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 