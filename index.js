const express = require('express');
const mongoose = require('mongoose');
const userRoute = require("./routes/user.router.js");
const bookRoute = require("./routes/books.router.js");
const adminRoute = require("./routes/admin.router.js");
const cors = require('cors');
const path = require("path");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());
app.use('/api/books', bookRoute);
app.use('/api/user', userRoute);
app.use('/admin', adminRoute);

app.get('/', (req, res) => {
    res.render('index.ejs', { url: `http://localhost:3000/` });
});


mongoose.connect(process.env.MONGODB_URI).then((response) => {
    app.listen(port, (req, res) => {
        console.log("listening on port" + port + " http://localhost:" + port);
    });
});


