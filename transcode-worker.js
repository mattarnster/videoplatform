const amqp = require('amqplib/callback_api');
const path = require('path');

const { spawn } = require('child_process');

var db = require('./models');
const { Console } = require('console');

var Videos = db.Video;

amqp.connect('amqp://localhost', function(err, conn) {
  
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
      
      console.log('HandBrakeCLI --preset-import-file ' + __dirname + '/handbrake-transcoding-defaults.json', '-i "' + videoPath + '"', '-o "' + videoPathTranscoded + '"')
      const handbrake = spawn('HandBrakeCLI', ['-Z "WEB SSFR Very Fast 1080p30"', '--preset-import-file "' + __dirname + '/handbrake-transcoding-defaults.json"', '-i ' + videoPath, '-o ' + videoPathTranscoded]);
      console.log(handbrake.spawnargs);

      handbrake.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });


      handbrake.stderr.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
      
      handbrake.on('close', code => {
        if (code !== 0) {
          Video.transcoded = true;
          Video.save();
        } else {
          console.log(code);
          console.log('Transcode error');
        }
      })
    }, { noAck: true });
    
  });
});