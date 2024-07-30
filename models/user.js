
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  address:{
    type: Schema.Types.Mixed,
    required: true
  },
  gender: { type: String, required: true },
  user_type: { type: String, enum: ['Regular', 'Admin'], default: 'Regular' },
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


const comparePassword = async (candidatePassword, existingPassword) => {
  // return bcrypt.compare(candidatePassword, existingPassword);
  return candidatePassword === existingPassword;
}


const User = mongoose.model('User', userSchema);
module.exports = {User, comparePassword };