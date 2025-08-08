const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
    if (username && password) {
      const userExists = users.some(user => user.username === username);
        if (!userExists) {
            users.push({"username":username,"password":password});
            return res.status(201).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(409).json({message: "User already exists!"});
        }
    }
    return res.status(400).json({message: "Unable to register user. Please provide both username and password."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.json(books[isbn]);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];
    for (const bookId in books) {
        if (books[bookId].author === author) {
            booksByAuthor.push(books[bookId]);
        }
    }
    if (booksByAuthor.length > 0) {
        return res.json(booksByAuthor);
    } else {
        return res.status(404).json({message: "No books found by this author"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];
    for (const bookId in books) {
        if (books[bookId].title === title) {
            booksByTitle.push(books[bookId]);
        }
    }
    if (booksByTitle.length > 0) {
        return res.json(booksByTitle);
    } else {
        return res.status(404).json({message: "No books found with this title"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
    if (books[isbn] && books[isbn].reviews) {
        return res.json(books[isbn].reviews);
    } else {
        return res.status(404).json({message: "Reviews not found for this book"});
    }
});

module.exports.general = public_users;
