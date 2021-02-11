var express = require('express');
var router = express.Router();

var db = require('../models');
var Videos = db.Video;

/* GET videos */
router.get('/', async function(req, res, next) {
  if (req.query['id']) {
    var vid = await Videos.findOne({ where: { watchId: req.query['id']} });
    if (vid === null) {
      return res.render('404');
    }
    return res.render('watch-video', { video: vid });
  }

  var vids = await Videos.findAll();
  return res.render('videos', { videos: vids });
});

module.exports = router;
