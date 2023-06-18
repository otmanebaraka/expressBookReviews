const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid.
    const indexOfUser = users.findIndex(user=> user.username === username);
    if(indexOfUser !== -1){
        return false;
    }
    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const user = users.find(user => user.username === username);
    if (user && user.password === password) {
        return true;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if(!username || !password){
        res.status(400).send('Username and Password are required');
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
        data: password
        }, 'fingerprint_customer', { expiresIn: 60 * 60 });

        req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
        return res.status(401).send('Invalid username or password');
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        const review = req.body.review;  // Changed from req.body.review to req.query.review
        const username = req.session.authorization.username;

        if (username) {
            // If a review by the current user already exists, update it. Otherwise, create a new one.
            book.reviews[username] = review;
            res.status(200).send('The review for the book with ISBN: '+ isbn + ' has been added/updated');
        } else {
            res.status(403).send('Unauthorized');
        }
    } else {
        res.status(404).send('Book not found');
    }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Get the isbn from the route parameters
    const isbn = req.params.isbn;
    // Get the book with the given isbn
    const book = books[isbn];

    if (book) {
        // Get the username from the session
        const username = req.session.authorization.username;

        if (username) {
            // Check if a review by the current user exists
            if (book.reviews.hasOwnProperty(username)) {
                // Delete the review
                delete book.reviews[username];
                res.status(200).send('Reviews for the book ISBN: ' + isbn + ' posted by ' + username + ' has been deleted');
            } else {
                res.status(404).send('No review found for the user on the specified book');
            }
        } else {
            res.status(403).send('Unauthorized');
        }
    } else {
        res.status(404).send('Book not found');
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
