import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import { initializeAdmin } from './controllers/authController.js';

dotenv.config();
const app = express();

app.use(cors({ 
  origin: "http://localhost:5173", 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB
connectDB();

// Initialize default admin
initializeAdmin();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: "CityCare API is running!",
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: "Welcome to CityCare API!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      issues: "/api/issues",
      health: "/api/health"
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler - FIXED: Use proper route pattern
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user'
      },
      issues: {
        'GET /api/issues': 'Get all issues (admin only)',
        'POST /api/issues': 'Create new issue',
        'GET /api/issues/my-issues': 'Get user issues',
        'GET /api/issues/stats': 'Get statistics (admin only)'
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});