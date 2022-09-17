const express = require('express')
const router = express.Router()
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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
    console.log(req.body)
    if (req.body.captcha === undefined || req.body.captcha === '' || req.body.captcha === null) {
        req.flash('error', 'Please complete captcha')
        res.redirect('/register')
    }

    const captchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${req.body.captcha}&remoteip=${req.socket.remoteAddress}`
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    async function getCaptchaData() {
        const response = await fetch(captchaUrl, options);
        const data = await response.json()
        return data
    }
    if (getCaptchaData().success !== undefined && !getCaptchaData().success) {
        req.flash('error', 'Captcha failed')
        res.redirect('/register')
    } else {
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
    }
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