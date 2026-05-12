import mongoose, { Schema } from 'mongoose';

const connectionSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
 
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
 
  connectedAt: {
    type: Date
  }

}, {
  timestamps: true 
});
 
connectionSchema.index({ sender: 1, receiver: 1 }, { unique: true });

connectionSchema.index({ sender: 1, status: 1 });
connectionSchema.index({ receiver: 1, status: 1 });

export const Connection = mongoose.model('Connection', connectionSchema);