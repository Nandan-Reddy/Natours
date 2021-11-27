const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require(`./../../models/tourModel.js`);
dotenv.config({ path: './../../config.env' });
const Review = require(`./../../models/reviewModel.js`);
const User = require(`./../../models/userModel.js`);

// console.log(process.env.DATABASE);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(con => {
    // / console.log(con.connections);
    console.log('Database  connection succesful!');
  });
// console.log(process.env);

//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

//IMPORT THE DATA INTO THE DATABASE
const importData = async function() {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data Succesfully loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//DELETING ALL DATA FROM COLLECTION
const deleteData = async function() {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data Succesfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

console.log(process.argv);
// console.log(tours);
// deleteData();
// importData();
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
