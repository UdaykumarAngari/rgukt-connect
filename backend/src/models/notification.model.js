import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  type: {
    type: String,
    enum: [
      'connection_request', 
      'connection_accept',  
      'post_like',          
      'post_comment',       
      'referral_request'    
    ],
    required: true
  },
 
  relatedEntity: {
    type: Schema.Types.ObjectId,
    refPath: 'entityModel'  
  },
  
  entityModel: {
    type: String,
    enum: ['Post', 'Job', 'Connection'],
    required: true
  },

  isRead: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true 
});

notificationSchema.index({ receiver: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);