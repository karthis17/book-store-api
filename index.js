const express = require('express');
const mongoose = require('mongoose');
const userRoute = require("./routes/user.router.js");
const bookRoute = require("./routes/books.router.js");
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/api/books', bookRoute);
app.use('/api/user', userRoute);


mongoose.connect("mongodb+srv://karthirs602:adminkarthi@cluster0.camz86p.mongodb.net/books_store?retryWrites=true&w=majority").then((response) =>{
    app.listen(port, (req, res) =>{
        console.log("listening on port" + port + " http://localhost:" + port);
    });
});


