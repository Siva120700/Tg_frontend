import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Response = mongoose.model('Response', responseSchema);
export default Response;
