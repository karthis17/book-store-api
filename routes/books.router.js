const router = require('express').Router();
const controller = require('../controller/book.controller.js');

router.get('/', async (req, res) => {
    try {
        const books = await controller.getAllBooks();
        res.status(200).send(books);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

router.post('/create', async (req, res) => {
    try {
        await controller.addBook(req.body);
        res.status(201).send({
            flag: true,
            message: 'Book added successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            flag: false,
            message: 'Internal Server Error'
        });
    }
});

router.get('/get/:id', async (req, res) => {
    try {
        const result = await controller.getBookByIdOrTitle(req.params.id);
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.get('/getBy/title/:title', async (req, res) => {
    try {
        const result = await controller.getBookByIdOrTitle(req.params.title);
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send({ message: err });
    }
});

router.get('/purchases/:title', async (req, res) => {
    try {
        await controller.bookPurchases(req.params.title);
        res.status(200).send({
            message: 'Success!',
            flag: true,
        });
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: err, flag: false });
    }
});

router.post('/comments/add', async (req, res) => {
    try {
        await controller.addComment(req.body.id, req.body.comment, req.body.name);
        res.status(201).send({
            flag: true,
            message: 'Comment added successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            flag: false,
            message: 'Internal Server Error'
        });
    }
});

router.get('/comments/get/:id', async (req, res) => {
    try {
        const comments = await controller.getComments(req.params.id);
        res.status(202).send(comments);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            flag: false,
            message: 'Internal Server Error'
        });
    }
});

router.get('/search/:title', async (req, res) => {
    try {
        const titles = await controller.searchBook(req.params.title);
        res.status(200).send({ data: titles });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            flag: false,
            message: 'Internal Server Error'
        });
    }
});

module.exports = router;
