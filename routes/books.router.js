const router = require('express').Router();
const book = require('../model/book.model.js');

router.get('/', (req, res) => {
    book.find().then(result => { res.send(result) }).catch(err => { res.sendStatus(404) });
});

router.post('/create', (req, res) => {
    book.create(req.body).then((result) => { res.status(200).send({ message: "book details add successfully." }) }).catch(err => { res.status(400).send({ message: "book details not added" }) });
});

router.get('/get/:id', (req, res) => {
    book.findById(req.params.id).exec().then((book) => { res.send(book) }).catch(err => { res.sendStatus(404) });
});

router.post('/comments', (req, res)=>{
    const comment_o = {
        name: req.body.name,
        comment: req.body.comment
    }
    book.findOneAndUpdate({_id: req.body.id}, { $push: { comments: comment_o } })
    .then(response => {
        res.status(200).send({
            flag: true,
            message: "comment added successfully"
        });
    }).catch(err => {
        res.status(500).send({
            flag:false,
            message: err
        });
    });
})

module.exports = router;