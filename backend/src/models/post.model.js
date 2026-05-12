import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',  
    required: true
  },
 
  content: {
    type: String,
    required: true,
    trim: true,
    maxLength: 2000 
  },

  images: [{
    type: String 
  }],

  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User' 
  }],

  comments: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  postType: {
    type: String,
    enum: ['general', 'internship', 'job'],
    default: 'general'
  },

  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
 
  isArchived: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true 
});

postSchema.index({ createdAt: -1 });

export const Post = mongoose.model('Post', postSchema);