const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Form = require('../models/contact-form');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const createContactForm = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data!', 422)
    );
  }
  const { name, email, subject, text } = req.body;
  console.log('name', name)

  const newForm = new Form({
    name,
    email,
    // subject,
    text,
    date: new Date(),
  });

  try {
    await newForm.save();
  } catch (err) {
    const error = new HttpError(
      'Saving form data failed, please try again later.',
      500
    );
    return next(error);
  }

  // let formData = `<h2>Email from: ${name}, email adress: ${email}, titled: ${subject}, content: ${text} </h2>`;
  let formData = `<h2>Email from: ${name}, email adress: ${email}, content: ${text} </h2>`;

  const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        // you can use here usrename as well
        api_key: process.env.SENDGRID_API_KEY,
      },
    })
  );

  try {
    await transporter.sendMail({
      to: 'spatulatom@gmail.com',
      from: 'spatulatom@gmail.com',
      subject: 'Portfolio Contact Form Data',
      html: formData,
    });
  } catch (err) {
    const error = new HttpError('Sending email failed, please try again!', 500);
    return next(error);
  }
  try {
    await transporter.sendMail({
      to: email,
      from: 'elkom9393@gmail.com',
      subject:
        'Tom Saptula',
      html: '<h2>I appreciate you taking your time and sending me an email through a Contact Form on my website https://projects-online.vercel.app/. I will reply to you shortly. <br> Kind regards,<br> TS</h2>',
    });
  } catch (err) {
    const error = new HttpError('Sending email failed, please try again!', 500);
    return next(error);
  }

  res
    .status(201)
    .json({ message: 'Form data has been sent & saved, thank you!' });
};

exports.createContactForm = createContactForm;
