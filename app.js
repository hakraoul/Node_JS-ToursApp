const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appErrors');

const globalErrorHandler = require('./controllers/errorController');

const app = express();
const tourRoute = require('./routes/tourRoutes');
const userRoute = require('./routes/userRoutes');

// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //morgan is a package help with displaying request or we called it logger
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //middleware that allow content of response to be process in the req
app.use(express.static(`${__dirname}/public`));

//1 . Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(r);
  next();
});

//3. Routes
//Best Practice to Declare route
app.use('/api/v1/tours', tourRoute); //when it reach this route it will execute the middleware
app.use('/api/v1/users', userRoute);

//Global Error
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} in this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} in this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
