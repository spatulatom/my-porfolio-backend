const express = require('express');
const { check } = require('express-validator');

const contactControllers = require('../controllers/contact-from-controllers');

const router = express.Router();


router.post(
    '/',
    [
      check('name').not()
      .isEmpty(),
      check('email')
        .not()
        .isEmpty(),
        // check('subject')
        // .not()
        // .isEmpty(),
        check('text')
        .not()
        .isEmpty()
    ],
    contactControllers.createContactForm
  );

  module.exports = router;