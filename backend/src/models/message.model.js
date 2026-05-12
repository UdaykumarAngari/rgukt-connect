const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
 
  attachments: [{
    fileUrl: String,
    fileType: { type: String, enum: ['image', 'pdf'] }
  }],
  
  isRead: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true  
});

MessageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', MessageSchema);
