import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  website: {
    type: String
  },
  bio: {
    type: String
  },
  phone: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('profile', ProfileSchema);

