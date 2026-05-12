import mongoose, { Schema } from 'mongoose';

const jobSchema = new Schema({
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },

  company: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String 
  },
  position: {
    type: String,
    required: true, 
    trim: true
  },
  location: {
    type: String,
    default: "Remote" 
  },

  jobType: {
    type: String,
    enum: ['Full-time', 'Internship', 'Contract', 'Part-time'],
    default: 'Full-time'
  },
  workMode: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid'],
    default: 'On-site'
  },
  salaryRange: {
    type: String 
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String 
  }],

  techStack: [{
    type: String,
    lowercase: true 
  }],


  applicationLink: {
    type: String 
  },
  
  isReferralAvailable: {
    type: Boolean,
    default: true 
  },
  
  referralInstructions: {
    type: String
  },

  applicants: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    resumeUrl: {
      type: String 
    }
  }],

 
  isActive: {
    type: Boolean,
    default: true
  },
  deadline: {
    type: Date
  }

}, {
  timestamps: true 
});


jobSchema.index({ company: 'text', position: 'text', techStack: 'text' });

export const Job = mongoose.model('Job', jobSchema);