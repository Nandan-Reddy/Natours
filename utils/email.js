/*eslint-disable */
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    // console.log(user);
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    console.log(user.email, 4);
    this.url = url;
    this.from = `Nandan Reddy <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //send grid
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  //send the actual email
  async send(template, subject) {
    //1)Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject: subject
    });
    // console.log(html, 5);
    console.log(process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD, 5);
    //2)Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText.fromString(html)
      // html:
    };
    console.log('hello world', 6);
    //3)create a transport and send email
    // await transporter.sendMail(mailOptions);
    await this.newTransport().sendMail(mailOptions);
    console.log('hello world', 7);
  }
  async sendWelcome() {
    await this.send('welcome', 'welcome to the natours family');
  }
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 min)'
    );
  }
};

// const sendEmail = async options => {
//   // // 1) Create a transporter
//   // const transporter = nodemailer.createTransport({
//   //   host: process.env.EMAIL_HOST,
//   //   port: process.env.EMAIL_PORT,
//   //   auth: {
//   //     user: process.env.EMAIL_USERNAME,
//   //     pass: process.env.EMAIL_PASSWORD
//   //   }
//   // });

//   // 2) Define the email options
//   const mailOptions = {
//     from: 'Jonas Schmedtmann <hello@jonas.io>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message
//     // html:
//   };

//   // 3) Actually send the email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
