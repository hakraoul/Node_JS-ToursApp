//this catchAsync take in a function argument and it will create a new anonymous func then it will assign it to the targeted function.
const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next); //this code will catch error. It replaces the use of try and catche
};

module.exports = catchAsync;
