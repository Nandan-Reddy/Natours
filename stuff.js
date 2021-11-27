const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

// app.get('/', (req, res) => {
//   //   res.status(200).send('Hello from the server side!');
//   res.status(200).json({
//     message: 'Hello from the server side!',
//     app: 'natours',
//   });
// });

// app.post('/', (req, res) => {
//   res.send('You can post ato this endpoints...');
// });

// app.get('/results', (req, res) => {
//   res.status(200).json({
//     message: 'These are the results',
//   });
//   //res.end('These are the results');
// });

// const port = 3000;
// app.listen(port, '127.0.0.1', () => {
//   console.log(`App running on port ${port} ...`);
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'sucess',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});
// :id -> declaration of a variable
//we use multiple variables
// :id? -> optional parameters
// /:id1/:id2?/:id3/:id4?
//id1,id3 -->mandatory parmeters
//id2,id4 --> are optional parameters
app.get(`/api/v1/tours/:id`, (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

  const tour = tours.find((ele) => {
    return ele.id === id;
  });
  // console.log(tour);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'sucess',
    data: {
      tour: tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'sucess',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return req.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here ...>',
    },
  });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return req.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const port = 3000;
//by default is local host
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
