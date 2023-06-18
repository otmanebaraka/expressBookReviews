const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next){
    // Get the JWT token from the session
    const token = req.session.authorization && req.session.authorization.accessToken;

    if (!token) {
        // If no token is present, return an error
        return res.status(403).send('Access denied. No token provided.');
    }

    try {
        // If the token is present, verify it
        const decoded = jwt.verify(token, 'fingerprint_customer');  

        // If the token is valid, store the decoded payload in the request object for use in other routes and call next()
        req.user = decoded;
        next();
    } catch (ex) {
        // If the token is not valid, return an error
        return res.status(400).send('Invalid token.');
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
