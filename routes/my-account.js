var express = require('express');
const { nanoid } = require('nanoid');
var router = express.Router();

const db = require('../models');
const Users = db.User;
const Videos = db.Video;

/* GET home page. */
router.get('/', async function (req, res, next) {
  if (!req.session.logged_in) {
    return res.redirect('/');
  }

  var user = await Users.findByPk(req.session.user_id);
  if (user === null) {
    return res.redirect('/');
  }

  return res.render('my-account/my-account', { user: user });
});

router.get('/uploader', async function (req, res, next) {
  if (!req.session.logged_in) {
    return res.redirect('/');
  }

  return res.render('my-account/uploader');
})

router.post('/uploader', async function (req, res, next) {
  if (!req.session.logged_in) {
    return res.redirect('/');
  }

  try {
    if (!req.files) {
      return res.send(400);
    }

    console.log('file');

    let upload = req.files.file;
    let uploadId = nanoid(10);

    console.log('upload id');

    let newVideo = await Videos.create({
      userId: req.session.user_id,
      title: upload.name,
      watchId: uploadId,
      description: "",
      originalFileName: upload.name,
      views: 0,
      likes: 0
    });

    console.log('video');

    await upload.mv('./public/videos/' + req.session.user_id + '/' + uploadId + '/' + upload.name);

    console.log('storage');

    return res.json(newVideo);

  } catch (err) {
    return res.status(500);
  }
});

router.get('/videos', async function (req, res, next) {
  let videos = await Videos.findAll({ where: { userId: req.session.user_id } });
  res.render('my-account/videos', { videos: videos });
});

router.get('/videos/edit/:id', async function (req, res, next) {
  let video = await Videos.findOne({ where: { watchId: req.params.id } });
  if (video && video.userId == req.session.user_id) {
    return res.render('my-account/edit-video', { video: video });
  } else {
    return res.sendStatus(401);
  }
});

router.post('/videos/edit/:id', async function (req, res, next) {
  let video = await Videos.findOne({ where: { watchId: req.params.id } });
  if (video && video.userId == req.session.user_id) {
    video.title = req.body.title;
    video.description = req.body.description.trim();
    await video.save();

    req.flash('success', 'Video updated successfully!');
    return res.redirect('/my-account/videos/edit/' + video.watchId);
  } else {
    return res.sendStatus(401);
  }
})

router.post('/videos/delete/:id', async function (req, res, next) {
  let video = await Videos.findOne({ where: { watchId: req.params.id } });
  if (video && video.userId == req.session.user_id) {
    await video.destroy();
    req.flash('success', 'Video deleted successfully!');
    return res.redirect('/my-account/videos');
  } else {
    return res.sendStatus(401);
  }
})

module.exports = router;
