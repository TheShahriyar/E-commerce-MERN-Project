const express = require("express");
const morgan = require("morgan");
const createError = require('http-errors');
const xssClean = require('xss-clean')
const rateLimit = require('express-rate-limit');
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");

const app = express();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: 'Too many requests from this IP. Please try again later',
});

// MiddleWare
app.use(rateLimiter);
app.use(xssClean());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/test', rateLimiter, (req, res) => {
  res.status(200).send({
    message: "Welcome to server"
  })
});

app.use('/api/seed', seedRouter)
app.use('/api/users', userRouter)

// Client error handling
app.use((req, res, next) => {
  createError(404, 'Route not found')
  next()
})

// Server error handling
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message
  })
})


module.exports = app;