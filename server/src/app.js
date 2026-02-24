const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes/index');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', routes);

// Global error handler — must be last
app.use(errorHandler);

module.exports = app;
