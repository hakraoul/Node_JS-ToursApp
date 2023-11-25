const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' }); //read the environment variable in config then will store it

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    connectTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 30000, // 30 seconds
    serverSelectionTimeoutMS: 30000,
  }) //connect to Mongodb ATLAS
  // .connect(process.env.DATABASE_LOCAL, {
  //   autoCreate: true,
  //   autoIndex: true,
  //   checkKeys: false,
  // }) //connect to Local database
  .then(() => {
    console.log('Database connected successfully');
  });

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
