import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['citizen', 'admin'],
    default: 'citizen'
  },
  wardNumber: {
    type: String,
    required: function() {
      return this.role === 'citizen';
    }
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create default admin user if doesn't exist
userSchema.statics.createDefaultAdmin = async function() {
  try {
    const adminExists = await this.findOne({ email: 'admin@citycare.com' });
    if (!adminExists) {
      await this.create({
        name: 'CityCare Admin',
        email: 'admin@citycare.com',
        password: 'admin123',
        role: 'admin',
        wardNumber: 'All'
      });
      console.log('✅ Default admin user created successfully');
      console.log('📧 Email: admin@citycare.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

export default mongoose.model('User', userSchema);