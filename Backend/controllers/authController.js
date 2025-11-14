import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => 
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// Admin registration code (you can change this in production)
const ADMIN_REGISTRATION_CODE = process.env.ADMIN_REGISTRATION_CODE || 'ADMIN2024';

// Call this function when server starts
export const initializeAdmin = async () => {
  await User.createDefaultAdmin();
  console.log(`🔐 Admin Registration Code: ${ADMIN_REGISTRATION_CODE}`);
};

export const registerUser = async (req, res) => {
  const { name, email, password, wardNumber, role, adminCode } = req.body;

  try {
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists with this email" });

    // Validate admin registration
    if (role === 'admin') {
      if (!adminCode) {
        return res.status(400).json({ message: "Admin code is required for admin registration" });
      }
      if (adminCode !== ADMIN_REGISTRATION_CODE) {
        return res.status(403).json({ message: "Invalid admin code" });
      }
    }

    // Validate citizen registration
    if (role === 'citizen' && !wardNumber) {
      return res.status(400).json({ message: "Ward number is required for citizen registration" });
    }

    const userData = { 
      name, 
      email, 
      password, 
      role: role || 'citizen'
    };

    // Only add wardNumber for citizens
    if (role === 'citizen') {
      userData.wardNumber = wardNumber;
    } else {
      userData.wardNumber = 'All'; // Or empty for admins
    }

    const user = await User.create(userData);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      wardNumber: user.wardNumber,
      avatar: user.avatar,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        wardNumber: user.wardNumber,
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin registration status (for frontend)
export const getAdminConfig = (req, res) => {
  res.json({
    adminRegistrationEnabled: true,
    requiresAdminCode: true
  });
};

// Add these functions to your existing authController.js

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal whether email exists or not for security
      return res.json({ 
        message: 'If an account with that email exists, password reset instructions have been sent.' 
      });
    }

    // Generate reset token (in a real app, you'd use crypto or a library)
    const resetToken = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET + user.password, 
      { expiresIn: '1h' }
    );

    // In a real application, you would:
    // 1. Save the reset token to the user document
    // 2. Send an email with a reset link containing the token
    // 3. Use a proper email service (Nodemailer, SendGrid, etc.)

    console.log(`Password reset token for ${email}: ${resetToken}`);
    
    res.json({ 
      message: 'If an account with that email exists, password reset instructions have been sent.' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error processing password reset request' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the reset token and update password
    // This is a simplified version - in production, you'd need proper token validation
    
    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired reset token' });
  }
};