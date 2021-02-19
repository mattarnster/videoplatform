const amqp = require('amqplib/callback_api');
const path = require('path');

const hbjs = require('handbrake-js');

var db = require('./models');

var Videos = db.Video;

amqp.connect('amqp://localhost', function(err, conn) {
  console.log(err);
  conn.createChannel(function(err, ch) {
    
    const q = 'transcode';
    ch.assertQueue(q, { durable: true });
    
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, async function(msg) {
      var videoObj = JSON.parse(msg.content);
      console.log(" [x] Received new transcode request for video id: %s", videoObj.toString());

      var Video = await Videos.findByPk(videoObj.id);

      const videoPath = path.join(__dirname, './public/videos/', Video.userId.toString(), Video.watchId.toString(), Video.originalFileName.toString());
      const videoPathTranscoded = path.join(__dirname,'/public/videos/', Video.userId.toString(), Video.watchId.toString(), '/transcoded.mp4');
      
      const options = {
        input: videoPath,
        output: videoPathTranscoded,
        preset: 'Web/Vimeo YouTube HQ 1080p60'
      }

      await hbjs.exec(options, async (err, stdout, stderr) => {
        console.log("transcode complete");
        Video.transcoded = true;
        await Video.save();
      })
      
    }, { noAck: true });
    
  });
});