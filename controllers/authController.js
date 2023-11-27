const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('./catchAsync');
const AppError = require('../utils/appErrors');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'Success',
    token: token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) check if email and password exist
  if (!email || !password) {
    return new AppError('Please provice right email and password', 400);
  }

  //2) Check if user exist
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return new AppError('Incorrect email or password', 401);
  }

  //3) Send token to client if everything is ok
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
