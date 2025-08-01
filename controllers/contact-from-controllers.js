const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Form = require('../models/contact-form');

const sgMail = require('@sendgrid/mail');

const createContactForm = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data!', 422)
    );
  }
  
  const { name, email, subject, text } = req.body;
  console.log('name', name);

  const newForm = new Form({
    name,
    email,
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

  // Email content to send to admin
  const formData = `<h2>Email from: ${name}, email address: ${email}, content: ${text}</h2>`;

  // Set up SendGrid
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const adminMessage = {
    to: 'spatulatom@gmail.com',
    from: 'spatulatom@gmail.com',
    subject: 'Portfolio Contact Form Data',
    html: formData,
  };

  try {
    await sgMail.send(adminMessage);
  } catch (err) {
    const error = new HttpError('SendGrid\'s free mail sending service is officially over. As of May 27, 2025, Twilio SendGrid began retiring its Free Email API', 500);
    return next(error);
  }

  // Email content to send to the user
  const userMessage = {
    to: email,
    from: 'spatulatom@gmail.com',
    subject: 'Thank you for contacting Tom Saptula',
    html: `<h2>I appreciate you taking your time and sending me an email through a Contact Form on my website https://projects-online.vercel.app/. I will reply to you shortly. <br> Kind regards,<br> Tom Saptula</h2>`,
  };

  try {
    await sgMail.send(userMessage);
  } catch (err) {
    const error = new HttpError('Sending email failed, please try again!', 500);
    return next(error);
  }

  res.status(201).json({ message: 'Form data has been sent & saved, thank you!' });
};

exports.createContactForm = createContactForm;
