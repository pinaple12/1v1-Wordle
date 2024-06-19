import express from 'express';
import enableWs from 'express-ws'; 
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session';

import WebAppAuthProvider from 'msal-node-wrapper'

const authConfig = {
 auth: {
     clientId: "SECRET",
        authority: "SECRET",
        clientSecret: "SECRET",
        redirectUri: "/SECRET" //https://final-project-wordle-1v1.azurewebsites.net
 },
 
	system: {
    	loggerOptions: {
        	loggerCallback(loglevel, message, containsPii) {
            	console.log(message);
        	},
        	piiLoggingEnabled: false,
        	logLevel: 3,
    	}
	}
};



import models from './models.js';
import apiRouter from './routes/api/api.js';
import { mountWs } from './routes/api/controllers/game.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { setDefaultHighWaterMark } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();
enableWs(app); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/build')));

const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "this is some secret key I am making up p8kn fwlihftrn3oinyswnwd3in4oin",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.use((req, res, next) => {
    req.models = models
    next()
});

app.use('/api', apiRouter);
mountWs(app);

app.get('/signin', (req, res, next) => {
    return req.authContext.login({
        postLoginRedirectUri: "/", // redirect here after login
    })(req, res, next);

});
app.get('/signout', (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/", // redirect here after logout
    })(req, res, next);

});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/build', 'index.html'));
  });

app.use(authProvider.interactionErrorHandler());

export default app;