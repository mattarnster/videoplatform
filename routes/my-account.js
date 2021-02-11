var express = require('express');
const { nanoid } = require('nanoid');
var router = express.Router();

const db = require('../models');
const Users = db.User;

/* GET home page. */
router.get('/', async function(req, res, next) {
  if (!req.session.logged_in) {
    return res.redirect('/');
  }

  var user = await Users.findByPk(req.session.user_id);
  if (user === null) {
    return res.redirect('/');
  }

  return res.render('my-account', { user: user });
});

router.get('/uploader', async function(req, res, next) {
  if (!req.session.logged_in) {
    return res.redirect('/');
  }

  return res.render('uploader');
})

router.post('/uploader', async function(req, res, next) {
  if (!req.session.logged_in) {
    return res.redirect('/');
  }

  try {
    if (!req.files) {
      return res.send(400);
    }

    let upload = req.files.file;
    let uploadId = nanoid(10);

    await upload.mv('./storage/videos/' + req.session.user_id + '/' + uploadId + '/' + upload.name);

  } catch (err) {
      return res.status(500);
  }
})

module.exports = router;
