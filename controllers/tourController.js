// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('./catchAsync');

// exports.checkID = (req, res, next, val) => {
//   const id = req.params.id * 1; //this will turn id from string to number
//   if (id > tours.length) {
//     return res.status(404).json({
//       status: 'failed',
//       message: 'Tour not found.',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status: 'Error',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

exports.getAllTour = catchAsync(async (req, res, next) => {
  // const tours = await Tour.find({
  //   duration: req.query.duration,
  //   difficulty: req.query.difficulty,
  // });

  // const tours = await Tour.find()
  //   .where('duration')
  //   .gte(5)
  //   .where('difficulty')
  //   .equals('easy');

  //EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filther()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query.exec();
  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // const id = req.params.id * 1; //this will turn id from string to number
  // const tour = tours.find((el) => el.id === id);
  const tour = await Tour.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    data: {
      tour,
    },
  });
});

//When we wrap catchAsync it will assign the anonymous func here.
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'Success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true, //validator run again on update method.
  });
  res.status(200).json({
    status: 'Success',
    tour,
  });

  //update new tour
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'Success',
  //       message: 'Tour update',
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   }
  // );
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'Success',
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numratings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(400).json({
    status: 'Success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const { year } = req.params;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }, //create an array include the tours name matched with condition
      },
    },
    { $addFields: { month: '$_id' } },
    {
      $project: {
        _id: 0,
      },
    },
    { $sort: { numTourStarts: -1 } }, //decending
    { $limit: 12 },
  ]);
  res.status(400).json({
    status: 'Success',
    data: {
      plan,
    },
  });
});
