const express = require('express');

const app = express();
const morgan = require('morgan');
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
  next();
});

//3. Routes
//Best Practice to Declare route
app.use('/api/v1/tours', tourRoute); //when it reach this route it will execute the middleware
app.use('/api/v1/users', userRoute);

//Global Error
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'failes',
    message: `Can't find ${req.originalUrl} in this server!`,
  });
});

module.exports = app;
