const User = require('../models/userModel');
const catchAsync = require('./catchAsync');

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'Success',
    data: {
      users,
    },
  });
});
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: 'Success',
    data: {
      user,
    },
  });
});
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(200).json({
    status: 'Success',
    data: {
      newUser,
    },
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'Success',
    data: {
      user
    }
  });
});
exports.deleteUser = async(req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'Success',
    message: 'User has been removed.',
  });
};
