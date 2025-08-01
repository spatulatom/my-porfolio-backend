const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const contactRoutes= require('./routes/contact-form-routes');
const HttpError = require('./models/http-error');

// https://expressjs.com/en/resources/middleware/cors.html#enabling-cors-pre-flight
const cors = require('cors');

const app = express();

app.options('*', cors()) 
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

// Add this before other routes
app.get('/', (req, res) => {
  res.send('Server is running');
});

  app.use('/contact-form',contactRoutes);


  app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;

  });

  app.use((error, req, res, next) => {
    
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
  });
console.log(process.env.PORT, 'Juser' );
  
  mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@freecluster.qqg7h.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT||5000);
  })
  .catch(err => {
    console.log(err);
  });



