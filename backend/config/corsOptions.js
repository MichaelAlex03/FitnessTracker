//Cross Origin Resource Sharing
const allowedOrigins = require('./allowedOrigins');

//Checks if origin is in whitelist if not sends back error
const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessState: 200
}

module.exports = corsOptions;