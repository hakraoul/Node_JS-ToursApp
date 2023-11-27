const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please us your name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide your password.'],
    minlength: [8, 'A tour name must more or equal to 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      //This only works only create or save
      validator: function (el) {
        return this.password == el;
      },
      message: "Confirm password doesn't match.",
    },
  },
});

userSchema.pre('save', async function (next) {
  //Only execute when the password field is modified.
  if (!this.isModified('password')) return next();

  //Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete the confirmPassword field as it is only for input validation
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  //The bcrupt compare function compares hashed password and unhashed password.
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
