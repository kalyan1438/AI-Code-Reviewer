// models/Submission.js
import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  analysis: {
    type: Object, // Store the entire JSON analysis result
    default: null,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const CodeSubmission = mongoose.model('Submission', SubmissionSchema);

export default CodeSubmission;