// serverjs

// [LOAD PACKAGES]
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var multer  = require('multer');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var mkdirp = require('mkdirp');

// [ CONFIGURE mongoose ]

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/my_mongodb');

// DEFINE MODEL
var UserInfo = require('./models/userInfo');
var GroupInfo = require('./models/groupInfo');
const { json } = require('body-parser');

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// [CONFIGURE SERVER PORT]

var port = process.env.PORT || 8080;

storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dest = 'uploads/' + req.body.group_name.toString().replace(/"/g, "") + "/";
        mkdirp.sync(dest);

      

        cb(null, dest);
      },
    filename: function(req, file, cb) {
      return crypto.pseudoRandomBytes(16, function(err, raw) {
        if (err) {
          return cb(err);
        }
        return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
      });
    }
  });

var upload = multer({ storage: storage });



// [CONFIGURE ROUTER]
var router = require('./routes')(app, UserInfo, GroupInfo, upload, fs);

// [RUN SERVER]
var server = app.listen(80, function(){
 console.log("Express server has started on port " + port)
});
