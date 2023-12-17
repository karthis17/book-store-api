const router = require('express').Router();
const bodyParser = require('body-parser');
const book = require('../controller/book.controller');
const user = require('../controller/user.controller');
require("dotenv").config();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());


router.use(bodyParser.urlencoded({ extended: true }));
passport.use(new LocalStrategy(
    function (username, password, done) {
        user.loginUser({ username: username, password: password }).then((res) => {
            console.log(res);
            if (!res) { return done(null, false); }
            if (res.admin) { done(null, res); }
            else { done(null, false); }
        });
    }
));

// Serialize and deserialize user
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    done(null, id);
});


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin/login');
}


router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/admin/dash-bord',
        failureRedirect: '/admin/login',
        failureFlash: true // Enable for flash messages
    })
);

router.get('/logout', function (req, res) {
    req.logout(function (err) {
        if (err) {
            // Handle error, if any
            console.error(err);
            return res.status(500).json({ message: 'Error logging out' });
        }
        // Redirect or respond after logout
        res.redirect('/admin/login'); // Redirect to login page after logout
    });
});


router.get('/login', (req, res) => {
    res.render('admin.login.ejs', { isWrong: false });
});


router.get('/dash-bord', ensureAuthenticated, async (req, res) => {

    res.render('admin.dashbord.ejs', { books: await book.getAllBooks(), users: await user.getAllUsers(), auth: process.env.auth });

});

router.get('/add', ensureAuthenticated, async (req, res) => {
    res.render('edit.book.ejs', {
        add: true,
    });
});

router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    console.log(req.params.id);
    book.getBookByIdOrTitle(req.params.id).then((book_details) => {
        // console.log(book_details);
        res.render('edit.book.ejs', { add: false, data: book_details });
    }).catch((err) => {
        res.send(err);
    })
});
router.post('/edit', ensureAuthenticated, (req, res) => {
    console.log(req.body);
    book.updateBook(req.body).then(() => {
        // console.log(book_details, "hi");
        res.redirect(`/admin/dash-bord`);
    }).catch((err) => {
        console.log(err, "hi");
        res.send(err);
    })
});

router.get('/book/delete/:id', (req, res) => {

    book.deleteBookById(req.params.id).then(() => {
        res.redirect('/admin/dash-bord');
    }).catch((err) => {
        console.log(err, "hi");
    });

});

router.post('/add/image', ensureAuthenticated, (req, res) => {

    book.addImage(req.params.id, req.body.image).then(async (response) => {
        res.render('admin.dashbord.ejs', { books: await book.getAllBooks(), users: await user.getAllUsers() });
    }).catch((err) => {
        console.log(err, "hi");
        res.send(err);
    });
});


module.exports = router;