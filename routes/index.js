const express = require('express')
const router = express.Router()

//PASSPORT
const passport = require('passport')

//MODELS
const User = require('../models/user')

//ABOUT ROUTE
router.get('/', (req, res) => {
    res.render('index')
})

//REGISTER ROUTES
router.get('/register', (req, res) => {
    res.render('register')
})
router.post('/register', (req, res) => {
    User.register({ username: req.body.username }, req.body.password, function (err) {
        if (err) {
            req.flash('error', err.message)
            console.log(err)
            res.redirect('/register')
        } else {
            passport.authenticate('local', { failureRedirect: '/login', failureFlash: true })(req, res, function () {
                req.flash('success', 'Registration successful. Welcome ' + req.user.username + '!');
                res.redirect('/gallery');
            })
        }
    })
})

//LOGIN & LOGOUT ROUTES
router.get('/login', (req, res) => {
    res.render('login')
})
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
    req.flash('success', 'Welcome back ' + req.user.username + '!');
    res.redirect('/gallery')
})

router.post('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.user = null
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    });
})

module.exports = router