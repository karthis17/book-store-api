const router = require('express').Router();
const book = require('../model/book.model.js');

router.get('/', (req, res) => {
    book.find().then(result => { res.send(result) }).catch(err => { res.sendStatus(404) });
});

router.post('/create', (req, res) => {
    book.create(req.body).then((result) => { res.status(200).send({ message: "book details add successfully." }) }).catch(err => { res.status(400).send({ message: "book details not added" }) });
});

router.get('/get/:id', (req, res) => {
    book.findById(req.params.id)
        .exec().then((book) => { res.send(book) }).catch(err => { res.sendStatus(404) });
});

router.get('/getBy/title/:title', async (req, res) => {
    try {
        let book = await book.findOne({ title: req.params.title });
        res.send(book);
    } catch (err) {
        res.status(404).send({
            success: false,
            message: err.message
        })
    }
});

router.get('/add-to/out-of-stock/:title', async (req, res) => {
    //in post request need to send list of book name
    try {
        let book_name = req.params.title;
        console.log(book_name);
        await book.findOneAndUpdate({ title: book_name }, { $set: { outOfStock: true } })
        res.status(200).send({
            flag: true,
            message: "successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            flag: false,
            message: err
        });
    }
})

router.post('/comments/add', (req, res) => {
    const comment_o = {
        name: req.body.name,
        comment: req.body.comment
    }
    console.log(comment_o);
    book.findOneAndUpdate({ _id: req.body.id }, { $push: { comments: comment_o } })
        .then(response => {
            res.status(200).send({
                flag: true,
                message: "comment added successfully"
            });
        }).catch(err => {
            console.log(err);
            res.status(500).send({
                flag: false,
                message: err
            });
        });
});

router.get('/comments/get/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let comment = await book.findById(id, { comments: 1, _id: 0 });
        console.log(comment);
        res.status(200).send(comment);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            flag: false,
            message: err
        });
    }
});

router.get('/search/:title', async (req, res) => {
    try {
        let book_name = req.params.title;
        let search_book = await book.find({ title: { $regex: book_name, $options: 'i' } }, { title: 1 }).sort({ title: 1 });
        console.log(search_book);
        res.status(200).send({ data: search_book });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            flag: false,
            message: err
        });
    }
});

module.exports = router;