const book = require('../model/book.model.js');
const mongoose = require('mongoose');

function getAllBooks() {
    return new Promise((resolve, reject) => {
        book.find().then((books) => {
            resolve(books);
        }).catch((err) => reject(err));
    });
}

function addBook(book) {
    return new Promise((resolve, reject) => {
        book.create(book)
            .then((res) => {
                if (!res) reject(res);
                resolve(res);
            }).catch((err) => reject(err));
    });
}

function updateBook(updated_book) {
    let id = updated_book.id;
    let book_details = {
        title: updated_book.title,
        rate: updated_book.rate,
        Language: updated_book.Language,
        Pages: updated_book.Pages,
        author: updated_book.author,
        available_copies: updated_book.available_copies,
        images: updated_book.images
    }
    return new Promise((resolve, reject) => {
        book.findOneAndUpdate({ _id: id }, { $set: book_details }).then((res) => {
            if (!res) {
                return reject(res);
            }
            resolve(res);
        }).catch((err) => { reject(err); });
    });
}

function deleteBookById(id) {

    return new Promise((resolve, reject) => {
        book.findByIdAndDelete(id).then((book) => {
            if (!book) {
                return reject({ message: 'Book not found' });
            }
            resolve(book);
        })
            .catch((err) => reject(err));
    });

}

function getBookByIdOrTitle(idOrTitle) {

    return new Promise((resolve, reject) => {
        book.findOne({
            $or: [
                { _id: new mongoose.Types.ObjectId(idOrTitle) }, // Search by ID
                { title: { $regex: idOrTitle, $options: 'i' } } // Search by title
            ]
        })
            .then((book) => {
                if (!book) {
                    return reject({ message: 'Book not found' });
                }
                console.log(book);
                resolve(book);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
    });

}

function bookPurchases(title) {
    return new Promise((resolve, reject) => {
        book.findOneAndUpdate({ title: title }, { $inc: { available_copies: -1 } })
            .then((book) => {
                if (!book) {
                    return reject(book);
                }
                console.log(book);
                resolve(true);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
    });

}

function addComment(id, comment, name) {

    return new Promise((resolve, reject) => {
        book.findOneAndUpdate({ _id: id }, { $push: { comments: { name: name, comment: comment } } })
            .then(response => {
                if (!response) {
                    return reject(false);
                }
                console.log(response);
                resolve(resolve);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
    });

}

function getComments(id) {

    return new Promise((resolve, reject) => {
        book.findById(id, { comments: 1, _id: 0 })
            .then(comments => {
                if (!comments) {
                    return reject(comments);
                }
                resolve(comments);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
    });

}

function searchBook(title) {

    return new Promise((resolve, reject) => {
        book.find({ title: { $regex: title, $options: 'i' } }, { title: 1 }).sort({ title: 1 })
            .then(books => {
                if (!books) {
                    return reject(books);
                }
                resolve(books);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
    });

}

function addImage(id, src) {
    return new Promise((resolve, reject) => {
        book.findOneAndUpdate({ _id: id }, { $push: { images: src } }).then(res => {
            if (!res) {
                return reject(res);
            }
            resolve(res);
        }).catch(err => { reject(err); });

    });
}

module.exports = {
    getAllBooks,
    getBookByIdOrTitle,
    getComments,
    searchBook,
    addComment,
    bookPurchases,
    addBook,
    updateBook,
    addImage,
    deleteBookById
}