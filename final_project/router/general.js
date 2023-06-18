const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if(!username || !password){
        res.status(400).send('Username and Password are required');
    }
    if(isValid(username)){
        users.push({
            username:username,
            password:password
        });
        res.status(201).json({
            message:'User Registred successfully'
        })
    }else{
        res.status(400).json({
            message:'Username is already taken'
        });
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    res.status(200).send({books:books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];
    if(book){
        res.status(200).send(book);
    }else{
        res.status(404).send('Book not found');
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const author = req.params.author;
    const booksArr = Object.values(books);
    const bookFounds = booksArr.filter(book=>book.author === author);
    if(bookFounds.length > -1){
        res.status(200).send(bookFounds);
    }else{
        res.status(404).send('Book not found');
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksArr = Object.values(books);
  const book = booksArr.filter(book=>book.title === title);
  if(book){
      res.status(200).send(book);
  }else{
      res.status(404).send('Book not found');
  }});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
      res.status(200).send(book.reviews);
  }else{
      res.status(404).send('Book not found');
  }});
  
//Task 10: 
public_users.get('/async-get-books',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(books);
    });

    get_books
        .then(books => {
            res.status(200).send(JSON.stringify(books, null, 4));
        })
        .catch(err => {
            res.status(500).send("An error occurred while fetching the books.");
        });
});
// Task 11:
public_users.get('/async-get-book/:isbn', function (req, res) {

    const get_book = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject('Book not found');
        }
    });

    get_book
        .then(book => {
            res.status(200).send(JSON.stringify(book, null, 4));
        })
        .catch(err => {
            res.status(404).send(err);
        });
});

// Task 12:
public_users.get('/async-book-author/:author',function (req, res) {
    
    const get_book = new Promise((resolve, reject) => {
        const author = req.params.author;
        const booksArr = Object.values(books);
        const bookIndex = booksArr.indexOf(book=>book.author === author);
        if(bookIndex !== -1){
            const book = booksArr[bookIndex];
            resolve(book)
        }else{
            reject('Book not found');
        }
    });

    get_book
        .then(book => {
            res.status(200).send(JSON.stringify(book, null, 4));
        })
        .catch(err => {
            res.status(404).send(err);
        });
});

// Task 13:
public_users.get('/async-book-title/:title',function (req, res) {
    
    const get_book = new Promise((reslove,reject)=>{
        const title = req.params.title;
        const booksArr = Object.values(books);
        const book = booksArr.filter(book=>book.title === title);
        if(book){
           reslove(book);
        }else{
            reject('Book not found');
        }  
    })
    get_book
        .then(book=>{
            res.status(200).send(JSON.stringify(book, null, 4));
        }).catch(err=>{
            res.status(404).send(err);
        })
});
module.exports.general = public_users;
