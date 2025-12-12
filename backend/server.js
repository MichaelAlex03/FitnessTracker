require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const path = require('path');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 3001;
const IP = process.env.IP

const app = express();



//logs requests made to server
app.use(logger);

app.use(credentials)

//handle form data
app.use(express.urlencoded({ extended: true }));

//handle json request
app.use(express.json());

// Cross Origin Resource Sharing
app.use(cors(corsOptions));


app.use(cookieParser());

//serve static files
app.use(express.static(path.join(__dirname, 'public')));


//put auth routes here before verifyJWT
app.use('/auth/register', require('./routes/auth/register'));
app.use('/auth/login', require('./routes/auth/login'));
app.use('/auth/refresh', require('./routes/auth/refresh'));
app.use('/auth/logout', require('./routes/auth/logout'));
app.use('/auth/passwordReset', require('./routes/auth/passwordReset'))


app.use(verifyJWT);

//put all api routes after verifyJWT
app.use('/api/exercises', require('./routes/api/exercises'));
app.use('/api/templates', require('./routes/api/templates'));
app.use('/api/workouts', require('./routes/api/workouts'));
app.use('/api/sets', require('./routes/api/sets'));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/history', require('./routes/api/history'));
app.use('/api/getPresignedUrl', require('./routes/api/s3'));
app.use('/api/openAI', require('./middleware/checkChatRateLimit'), require('./routes/api/openAI'));


/* This makes it so that when we test it in our integration tests we dont start listening on this 
*  server we just import the app object. Without require.main === module the app object will start
*  listening on this server while we test but the port will remain open since we dont close it in testing */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://${IP}:${PORT}`);
  });
}

module.exports = app