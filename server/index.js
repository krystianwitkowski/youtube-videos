const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const config = dotenv.config();
const app = express();

const init = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const register = require('./routes/register.js');
const login = require('./routes/login.js');
const credentials = require('./routes/credentials.js');

app.use(bodyParser.json());
app.use(express.static('dist'));
app.use(cookieParser());

app.use('/api/register', register);
app.use('/api/login', login);
app.use('/api/credentials', credentials);

const listen = app.listen(process.env.PORT, () => {
    console.log(`Listening server on: ${process.env.PORT}`)
});


