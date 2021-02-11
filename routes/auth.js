var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt')

const db = require('../models');
var Users = db.User;

const { body, validationResult } = require('express-validator');

/* GET login */
router.get('/', function (req, res, next) {
  if (req.session.logged_in) {
    return res.redirect('/');
  }
  res.render('login');
});

/* POST login */
router.post(
  '/',
  body('email').exists(),
  body('password').exists(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('failure', 'Both fields are required.')
      return res.render('login');
    }

    let { email, password } = req.body;

    var user = await Users.findOne({ where: { email: email } });

    if (user === null) {
      req.flash('failure', 'Invalid email/password');
      return res.render('login');
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        req.flash('failure', 'Internal server error, try again later.');
        return res.render('login');
      }

      if (result) {
        req.session.logged_in = true;
        req.session.user_id = user.id;
        req.flash('success', 'Login successful!');
        res.redirect('/');
      } else {
        req.flash('failure', 'Invalid email/password');
        return res.render('login');
      }
    })
  }
);

/* GET signup */
router.get('/signup', (req, res, next) => {
  if (req.session.logged_in) {
    return res.redirect('/');
  }
  res.render('signup')
});

/* POST signup */
router.post(
  '/signup',
  body('first_name').isLength({ min: 2 }),
  body('last_name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isStrongPassword(),
  body('confirm_password').exists(),
  async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('failure', errors.toString())
      return res.render('signup');
    }

    if (req.body.password !== req.body.confirm_password) {
      req.flash('failure', 'Passwords don\'t match');
      return res.render('signup');
    }

    bcrypt.hash(req.body.password, 12, async (err, encPassword) => {
      await Users.create({
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        email: req.body.email,
        password: encPassword
      });
    });

    req.flash('success', 'Your account has been created!');
    return res.redirect('/auth');
  }
);

router.post('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;
