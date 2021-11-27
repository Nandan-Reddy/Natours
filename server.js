const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app.js');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => {
    // / console.log(con.connections);
    console.log('DB connection succesful!');
  })
  .catch(err => {
    console.log('ERROR');
  });
// console.log(process.env);

const port = 3000;
//by default is local host
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});

// console.log(app.get('env'));

//TEST

// process.on('unhandledRejection', err => {
//   console.log(err.name, err.message);
//   console.log('UNHANDELED REJECTION 😡 shutting down');
//   server.close(() => {
//     process.exit(1);
//   });
// });
