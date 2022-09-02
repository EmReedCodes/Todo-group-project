const router = require('express').Router();
const passport = require('passport');

// auth login
router.get('/login', (req,res) => {
    res.render('login');
});

router.get('/google') {}
