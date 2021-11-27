const Tour = require(`./../models/tourModel.js`);
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError.js');
const User = require('./../models/userModel.js');
const Booking = require('./../models/bookingModel.js');

exports.getOverview = catchAsync(async (req, res) => {
  // 1)Get tour data from collection
  const tours = await Tour.find();
  //2)Build template

  //3)Render the template
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' ws: https://*.mapbox.com https://*.stripe.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src-elem 'self' https: ;script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com/v3/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    // .set(
    //   'Content-Security-Policy',//script-src-elem
    //   "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;script-src-elem  'self';frame-ancestors 'self';img-src 'self' blob: data: ;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ; 'self';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    // )
    .render('overview', {
      title: 'All tours',
      tours: tours
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1)get the data ,for the required tour including reviews and guides
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }

  //2)Build template

  //3)Render template using the data
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' blob: data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour: tour
    });
});

exports.getLoginForm = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('login', {
      title: 'Log into your account'
    });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Yout account'
  });
};

exports.getMyTours = async (req, res, next) => {
  //1)Find all booking
  const bookings = await Booking.find({ user: req.user.id });
  //2)find tours with the returned id's
  const tourIDs = bookings.map(el => {
    return el.tour;
  });
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', {
    title: 'My tours',
    tours
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  // console.log('UPDATING USER', req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidator: true
    }
  );
  res.status(200).render('account', {
    title: 'Yout account',
    user: updatedUser
  });
});
