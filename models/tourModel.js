const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a aname.'],
      unique: true,
      maxlength: [30, 'A tour name must less or equal to 30 letter'],
      minlength: [10, 'A tour name must more or equal to 10 letter'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],//demo only
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration.'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a size.'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty should only be easy, medium and difficult.',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5.0, 'A rating must be maximum of 5'],
      min: [1.0, 'A rating must be maximum of 1'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price.'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this. only point to current doc when creating NEW document.
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price.', //VALUE here will access the val in validator function.
      },
    },
    summary: {
      type: String,
      trim: true, //remove white space
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image.'],
    },
    images: [String], //an array of strings
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      defaule: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Document Middleware. run before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('save', (next) => {
  console.log('will save document');
  next();
});

//after the doc saved.
tourSchema.post('save', (doc, next) => {
  console.log(doc);
  next();
});

//Query Middleware. run before find()
//regex : all string include find will execute this function.
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  console.log(this.start);
  next();
});

tourSchema.post(/^find/, (doc, next) => {
  console.log(`Query Took ${Date.now() - this.start} milliseconds`);
  // console.log(doc);
  next();
});

//Aggregation middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
