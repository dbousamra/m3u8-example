var express = require('express');
var app = express();
var m3u = require('m3u')
var fs  = require('fs')
var _   = require('lodash')
var moment = require('moment')

var port = process.env.PORT || 3001


function getFiles (dir, files_){
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files){
    var name = dir + '/' + files[i];
    // console.log(files[i])
    if (fs.statSync(name).isDirectory()){
      getFiles(name, files_);
    } else {
      files_.push(files[i]);
    }
  }
  return files_;
}

// var videoFiles = [
//   { name: "assets/fileSequence0.ts",  duration: 9.97667 },
//   { name: "assets/fileSequence1.ts",  duration: 9.97667 },
//   { name: "assets/fileSequence2.ts",  duration: 9.97667 },
//   { name: "assets/fileSequence3.ts",  duration: 9.97667 },
//   { name: "assets/fileSequence4.ts",  duration: 9.97667 },
//   { name: "assets/fileSequence5.ts",  duration: 9.97667 },
//   { name: "assets/fileSequence6.ts",  duration: 9.97667 },
//   { name: "assets/fileSequence7.ts",  duration: 9.97667 },
//   { name: "assets/fileSequence8.ts",  duration: 9.97667 },
//   { name: "assets/fileSequence9.ts",  duration: 9.97667 },
//   { name: "assets/fileSequence10.ts", duration: 9.97667 },
//   { name: "assets/fileSequence11.ts", duration: 9.97667 },
//   { name: "assets/fileSequence12.ts", duration: 9.97667 },
//   { name: "assets/fileSequence13.ts", duration: 9.97667 },
//   { name: "assets/fileSequence14.ts", duration: 9.97667 },
//   { name: "assets/fileSequence15.ts", duration: 9.97667 },
//   { name: "assets/fileSequence16.ts", duration: 9.97667 },
//   { name: "assets/fileSequence17.ts", duration: 9.97667 },
//   { name: "assets/fileSequence18.ts", duration: 9.97667 },
//   { name: "assets/fileSequence19.ts", duration: 9.97667 },
//   { name: "assets/fileSequence20.ts", duration: 9.97667 }
// ]

var videoFiles = [
  { name: "assets/bad/9fc1a264af66e8acb04953bc6634fb6e.ts", duration: 9.999367 },
  { name: "assets/bad/1338d66c9db2bbd14fb0ed7314142081.ts", duration: 9.930767 },
  { name: "assets/bad/3e52720b320379de8afc940c3d1b7d34.ts", duration: 9.968911 },
  { name: "assets/bad/76840c8ca9087a3617a26bc3f35a65b4.ts", duration: 10.001522 },
  { name: "assets/bad/f556365df51ffbe75b7941f8adeffbd7.ts", duration: 9.9896 },
  { name: "assets/bad/112b0ba0f17b3c89d489de9d0142f0af.ts", duration: 9.930921 },
  { name: "assets/bad/aab2d249238a9954c689608014b71970.ts", duration: 9.947978 },
  { name: "assets/bad/74b680c7ed937237d2725ff48e5c76e7.ts", duration: 9.989367 },
  { name: "assets/bad/4eb53b89152b7e71ccbf4106bb62c09f.ts", duration: 9.960488 },
  { name: "assets/bad/802301f43bc485a38d16fca7ccba209e.ts", duration: 9.930622 },
  { name: "assets/bad/735ad6f5fdd0dc835aee6ec43381b7c9.ts", duration: 9.960455 },
  { name: "assets/bad/b8f647a0454b7db4e688563e672d98e8.ts", duration: 10.1859 },
  { name: "assets/bad/d231ab8be6141bbe416f58008ea67296.ts", duration: 9.929189 },
  { name: "assets/bad/8e23a6759d059e4fd171d014b017a6ee.ts", duration: 9.989556 },
  { name: "assets/bad/714f442720641d52890ccb93168ac1bb.ts", duration: 9.962233 },
  { name: "assets/bad/fffd25eef49b09f3043cac5351e60cb6.ts", duration: 9.932433 },
  { name: "assets/bad/84ca8ee8e8288345942fbcc9534fbcc4.ts", duration: 9.951922 },
  { name: "assets/bad/569bd2ae272d39a0f7c1724fab54f802.ts", duration: 10.179744 },
  { name: "assets/bad/3eb39aca41264240c7e744178ccab0e9.ts", duration: 9.92991 },
  { name: "assets/bad/d79ea030e730cfb0ed97dca18bf92fdd.ts", duration: 9.945732 },
  { name: "assets/bad/ba5cb7d6e71b3af6085063755b8b64c3.ts", duration: 9.950189 },
  { name: "assets/bad/a0215e84375d3151160385c0d79e44f3.ts", duration: 9.953889 },
  { name: "assets/bad/e183e491536fcc9a96f1cfd35eb7288c.ts", duration: 10.000556 },
  { name: "assets/bad/16ac73a4244019c9127fd8d6214c4fc3.ts", duration: 9.950989 },
  { name: "assets/bad/68f7435eaf2c7f43d65958c1a07c10b7.ts", duration: 9.928811 },
  { name: "assets/bad/0232bf6fbd42d17be589098c4106a713.ts", duration: 9.970067 },
  { name: "assets/bad/4c2c53eba511f733c230f69f287140dc.ts", duration: 9.989744 },
  { name: "assets/bad/b1b28043777d49f1c9383df60c1b1893.ts", duration: 9.922744 },
  { name: "assets/bad/c0fd374204afa18f8d304588f6843c2a.ts", duration: 9.932378 },
  { name: "assets/bad/1b2ff9465019a9e331e03bf1b2ee729e.ts", duration: 10.0335 }
]

express.static.mime.define({'video/mp2t': ['ts']});
app.use('/assets', express.static('assets'));

app.get('/playlist.m3u8', function (req, res) {
  
  var videoFilesToTake;
  if (req.query.start) {
    var uploadTime = 6
    var start = new Date(parseInt(req.query.start)).valueOf()
    var diffInSeconds = (new Date().valueOf() - start) / 1000
    var toTake = Math.floor(diffInSeconds / uploadTime)
    videoFilesToTake = _.take(videoFiles, toTake)
  } else {
    videoFilesToTake = videoFiles
  }

  var writer = m3u.httpLiveStreamingWriter()
  // EXT-X-VERSION: Indicates the compatibility version of the Playlist file.
  // (optional)
  writer.version(6);

  // EXT-X-TARGETDURATION: Maximum media file duration.
  writer.targetDuration(10);

  // EXT-X-MEDIA-SEQUENCE: Sequence number of first file (optional).
  // (optional)
  writer.mediaSequence(0)


  // EXT-X-ALLOW-CACHE: Set if the client is allowed to cache this m3u file.
  // (optional)
  writer.allowCache(true);

  // EXT-X-PLAYLIST-TYPE: Provides mutability information about the m3u file.
  // (optional)
  writer.playlistType('EVENT');

  _.each(videoFilesToTake, function(file) {
    writer.file(req.protocol + '://' + req.get('host') + "/" + file.name, '9.97667');
  })

  // EXT-X-ENDLIST: Indicates that no more media files will be added to the m3u file.
  // (optional)
  if (videoFilesToTake.length === videoFiles.length) {
    writer.endlist();
  }

  res
    .set('Content-Type', 'application/x-mpegURL')
    .send(writer.toString());
});

app.listen(port, function () {
  console.log('Example app listening on port' + port);
});