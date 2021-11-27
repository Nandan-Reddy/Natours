/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts.js';
const stripe = Stripe(
  'pk_test_51JyduYSHUzYYGjXYEk0noLi4ZplJfBR5gleiZ12fH9fyB5vhbfmgcqshTGbBOM5bZxJgpnEcSKXKenBtaA4MPggg00wTso5lLC'
);

export const bookTour = async tourId => {
  try {
    // /1)Get the session from the API
    console.log('Hello world');
    const url = `/../../../api/v1/bookings/checkout-session/${tourId}`;
    console.log(url);
    const session = await axios(url);
    //   const session = await axios({
    //     // method : 'GET',
    //     url: `http:127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    //   });

    console.log(session);

    //2)create checkout from + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlerts('error', err);
  }
};
