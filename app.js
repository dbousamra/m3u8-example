var express = require('express');
var app = express();
var m3u = require('m3u')
var fs  = require('fs')
var _   = require('lodash')
var moment = require('moment')


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

var videoFiles = [
  { name: "assets/fileSequence0.ts",  duration: 9.97667 },
  { name: "assets/fileSequence1.ts",  duration: 9.97667 },
  { name: "assets/fileSequence2.ts",  duration: 9.97667 },
  { name: "assets/fileSequence3.ts",  duration: 9.97667 },
  { name: "assets/fileSequence4.ts",  duration: 9.97667 },
  { name: "assets/fileSequence5.ts",  duration: 9.97667 },
  { name: "assets/fileSequence6.ts",  duration: 9.97667 },
  { name: "assets/fileSequence7.ts",  duration: 9.97667 },
  { name: "assets/fileSequence8.ts",  duration: 9.97667 },
  { name: "assets/fileSequence9.ts",  duration: 9.97667 },
  { name: "assets/fileSequence10.ts", duration: 9.97667 },
  { name: "assets/fileSequence11.ts", duration: 9.97667 },
  { name: "assets/fileSequence12.ts", duration: 9.97667 },
  { name: "assets/fileSequence13.ts", duration: 9.97667 },
  { name: "assets/fileSequence14.ts", duration: 9.97667 },
  { name: "assets/fileSequence15.ts", duration: 9.97667 },
  { name: "assets/fileSequence16.ts", duration: 9.97667 },
  { name: "assets/fileSequence17.ts", duration: 9.97667 },
  { name: "assets/fileSequence18.ts", duration: 9.97667 },
  { name: "assets/fileSequence19.ts", duration: 9.97667 },
  { name: "assets/fileSequence20.ts", duration: 9.97667 }
]

express.static.mime.define({'video/mp2t': ['ts']});
app.use('/assets', express.static('assets'));

app.get('/playlist.m3u8', function (req, res) {
  
  var uploadTime = 6
  var start = new Date(parseInt(req.query.start)).valueOf()
  var diffInSeconds = (new Date().valueOf() - start) / 1000
  console.log(diffInSeconds)
  var toTake = Math.floor(diffInSeconds / uploadTime)
  var videoFilesToTake = _.take(videoFiles, toTake)

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

app.listen(3001, function () {
  console.log('Example app listening on port 3000!');
});