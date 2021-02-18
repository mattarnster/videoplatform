var express = require('express');
var router = express.Router();
var path = require('path');

var db = require('../models');
var User = db.User;
var Videos = db.Video;

/* GET videos */
router.get('/', async function(req, res, next) {
  if (req.query['id']) {
    var vid = await Videos.findOne({ where: { watchId: req.query['id'], published: true} });
    if (vid === null) {
      return res.render('404');
    }
    return res.render('videos/watch-video', { video: vid });
  }

  var vids = await Videos.findAll(({ where: { published: true }, include: User }));
  console.log(vids)
  return res.render('videos/videos', { videos: vids });
});

router.get('/getVideo/:id', async function (req, res, next) {
  var vid = await Videos.findOne({ 
    where: { watchId: req.params.id }, 
    include: {
      model: User, 
      as: 'User'
    }
  });
  if (vid === null) {
    return res.render('404');
  }
  
  if (vid.published === false && req.session.user_id === vid.userId) {
    return res.sendFile('public/videos/' + vid.userId + '/' + vid.watchId + '/transcoded.mp4', {
      root: './'
    });
  } else if (vid.published === false) {
    return res.sendStatus(401);
  }

  vid.views += 1;
  await vid.save();
  
  return res.sendFile('public/videos/' + vid.userId + '/' + vid.watchId + '/transcoded.mp4', {
    root: './'
  })
})

module.exports = router;
