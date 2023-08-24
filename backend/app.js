const express = require('express');
const errorMiddleware = require('./middleware/error');
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const middlewareSetup = require('./middleware/middlewareSetup');
const cors = require("cors");
const app = express();
app.use(cors()); 

app.use(middlewareSetup);//express session setup,passport configuration etc

app.use('/api/v1', product);
app.use('/api/v1', user);

// Middleware for error handling
app.use(errorMiddleware);

module.exports = app;
