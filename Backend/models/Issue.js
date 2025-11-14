import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Road', 'Water', 'Electricity', 'Garbage', 'Sanitation', 'Other'],
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    wardNumber: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  images: [{
    url: String,
    publicId: String
  }],
  status: {
    type: String,
    enum: ['reported', 'in-progress', 'resolved', 'closed'],
    default: 'reported'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolutionDetails: {
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    notes: String,
    beforeImage: String,
    afterImage: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Issue', issueSchema);